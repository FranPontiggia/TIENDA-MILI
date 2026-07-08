import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const outArg = args.find((arg) => arg.startsWith("--out="));
const outputPath = outArg ? outArg.replace("--out=", "").trim() : "./products-import.json";

const VALID_CATEGORIAS = new Set(["Hogar", "Comercio"]);

function loadEnvFile(fileName) {
  const filePath = resolve(fileName);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function toCleanString(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
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

function normalizeImageArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => normalizeImagePath(entry)).filter(Boolean);
}

function normalizeCuotas(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const dias = toNumber(item.dias, 0);
      const diaria = toNumber(item.diaria, 0);
      if (dias <= 0 || diaria <= 0) return null;

      return { dias, diaria };
    })
    .filter(Boolean);
}

function normalizeProducto(row) {
  const record = row && typeof row === "object" ? row : {};
  const id = toNumber(record.id, 0);
  const categoriaRaw = toCleanString(record.categoria);

  const normalized = {
    id,
    nombre: toCleanString(record.nombre),
    precio: toNumber(record.precio, 0),
    descripcion: toCleanString(record.descripcion),
    color: toCleanString(record.color),
    categoria: VALID_CATEGORIAS.has(categoriaRaw) ? categoriaRaw : "Hogar",
    subcategoria: toCleanString(record.subcategoria ?? record["subcategor\u00eda"]),
    imagen: normalizeImagePath(record.imagen),
    imagenes: normalizeImageArray(record.imagenes),
    cuotas: normalizeCuotas(record.cuotas),
  };

  if (!normalized.subcategoria) {
    normalized.subcategoria = "Cuidado del hogar";
  }

  return normalized;
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  const tableName = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_TABLE ?? process.env.SUPABASE_PRODUCTS_TABLE ?? "productos";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.from(tableName).select("*").order("id", { ascending: true });

  if (error) {
    throw new Error(`Could not read table ${tableName}: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  const normalizedProducts = rows
    .map((row) => normalizeProducto(row))
    .filter((producto) => producto.id > 0 && producto.nombre !== "");

  if (dryRun) {
    console.log(`Dry run: ${normalizedProducts.length} products would be exported to ${outputPath}.`);
    console.log(JSON.stringify(normalizedProducts.slice(0, 20), null, 2));
    if (normalizedProducts.length > 20) {
      console.log(`... and ${normalizedProducts.length - 20} more products.`);
    }
    return;
  }

  const resolvedOutput = resolve(outputPath);
  writeFileSync(resolvedOutput, `${JSON.stringify(normalizedProducts, null, 2)}\n`, "utf8");

  console.log(`Export complete. ${normalizedProducts.length} products saved to ${resolvedOutput}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
