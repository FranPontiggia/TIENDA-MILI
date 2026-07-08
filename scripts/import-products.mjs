import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
let filePath = "./products-import.json";
let dryRun = false;
let strictMode = false;

const validCategorias = new Set(["Hogar", "Comercio"]);
const warnings = [];

function loadEnvFile(fileName) {
  const envPath = resolve(fileName);
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function toCleanString(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function toPositiveNumber(value, fallback = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return fallback;
  return numeric;
}

function normalizeImagePath(value) {
  const cleaned = toCleanString(value);
  if (!cleaned) return "";

  const withoutExtraSpaces = cleaned.replace(/^\/imagen\/\s+/, "/imagen/").trim();
  if (withoutExtraSpaces.startsWith("/imagen/") && !/\.[a-zA-Z0-9]+$/.test(withoutExtraSpaces)) {
    return `${withoutExtraSpaces}.jpeg`;
  }

  return withoutExtraSpaces;
}

function normalizeCuotas(value, contextLabel) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        warnings.push(`${contextLabel}: cuota ${index + 1} ignorada por formato invalido.`);
        return null;
      }

      const dias = toPositiveNumber(item.dias, 0);
      const diaria = toPositiveNumber(item.diaria, 0);
      if (dias <= 0 || diaria <= 0) {
        warnings.push(`${contextLabel}: cuota ${index + 1} ignorada por valores invalidos.`);
        return null;
      }

      return { dias, diaria };
    })
    .filter(Boolean);
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--file") {
    filePath = args[index + 1];
    index += 1;
  } else if (arg === "--dry-run") {
    dryRun = true;
  } else if (arg === "--strict") {
    strictMode = true;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const resolvedPath = resolve(filePath);
const rawData = readFileSync(resolvedPath, "utf8");
const payload = JSON.parse(rawData);

if (!Array.isArray(payload)) {
  throw new Error("El archivo debe contener un array de productos.");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const tableName = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_TABLE ?? process.env.SUPABASE_PRODUCTS_TABLE ?? "productos";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const normalizedProducts = payload.map((item, index) => {
  const producto = item ?? {};
  const contextLabel = `Producto ${index + 1}`;
  const nombre = toCleanString(producto.nombre);
  const categoria = toCleanString(producto.categoria) || "Hogar";
  const imagen = normalizeImagePath(producto.imagen);

  if (!nombre) {
    warnings.push(`${contextLabel}: falta nombre.`);
  }

  if (!validCategorias.has(categoria)) {
    warnings.push(`${contextLabel}: categoria '${categoria}' no valida, se usara 'Hogar'.`);
  }

  if (!imagen) {
    warnings.push(`${contextLabel}: falta imagen principal.`);
  }

  const parsedId = Number(producto.id);
  const row = {
    nombre,
    precio: toPositiveNumber(producto.precio, 0),
    descripcion: toCleanString(producto.descripcion),
    color: toCleanString(producto.color),
    categoria: validCategorias.has(categoria) ? categoria : "Hogar",
    subcategoria: toCleanString(producto.subcategoria) || "Cuidado del hogar",
    imagen,
    imagenes: Array.isArray(producto.imagenes)
      ? producto.imagenes.map((value) => normalizeImagePath(value)).filter(Boolean)
      : [],
    cuotas: normalizeCuotas(producto.cuotas, contextLabel),
  };

  if (producto.id != null && producto.id !== "") {
    if (Number.isFinite(parsedId) && parsedId > 0) {
      row.id = parsedId;
    } else {
      warnings.push(`${contextLabel}: id '${producto.id}' invalido, se insertara sin id.`);
    }
  }

  return row;
}).filter((row) => row.nombre !== "");

if (strictMode && warnings.length > 0) {
  console.error("Modo --strict activo: se encontraron advertencias que deben corregirse antes de importar.");
  warnings.forEach((warning) => console.error(`- ${warning}`));
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`Se detectaron ${warnings.length} advertencias de calidad de datos:`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (dryRun) {
  console.log(`Modo de prueba: se insertarían ${normalizedProducts.length} productos en la tabla ${tableName}.`);
  console.log(JSON.stringify(normalizedProducts.slice(0, 20), null, 2));
  if (normalizedProducts.length > 20) {
    console.log(`... y ${normalizedProducts.length - 20} productos más.`);
  }
  process.exit(0);
}

if (normalizedProducts.length === 0) {
  console.error("No hay productos validos para cargar.");
  process.exit(1);
}

const batches = chunkArray(normalizedProducts, 200);
let importedCount = 0;

for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
  const batch = batches[batchIndex];
  const { data, error } = await supabase.from(tableName).upsert(batch, { onConflict: "id" }).select("id");

  if (error) {
    console.error(`Error al insertar lote ${batchIndex + 1}/${batches.length}:`, error.message);
    process.exit(1);
  }

  importedCount += data?.length ?? 0;
  console.log(`Lote ${batchIndex + 1}/${batches.length} importado (${batch.length} productos).`);
}

console.log(`Importacion completada. Registros insertados/actualizados: ${importedCount}.`);
