import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((arg) => arg.startsWith("--only="));
const onlyText = onlyArg ? onlyArg.replace("--only=", "").trim().toLowerCase() : "";

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

function normalizeImagePath(value) {
  if (typeof value !== "string") return "";

  const cleaned = value.trim().replace(/^['"]|['"]$/g, "");
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

function changed(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  const tableName = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_TABLE ?? process.env.SUPABASE_PRODUCTS_TABLE ?? "productos";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local/.env.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const selectFields = "id,nombre,imagen,imagenes";
  let query = supabase.from(tableName).select(selectFields).order("id", { ascending: true });
  if (onlyText) {
    query = query.ilike("nombre", `%${onlyText}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`No se pudo leer la tabla ${tableName}: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  const updates = [];

  for (const row of rows) {
    const imagen = normalizeImagePath(row.imagen);
    const imagenes = normalizeImageArray(row.imagenes);
    const before = {
      imagen: row.imagen ?? "",
      imagenes: Array.isArray(row.imagenes) ? row.imagenes : [],
    };
    const after = { imagen, imagenes };

    if (changed(before, after)) {
      updates.push({
        id: row.id,
        nombre: row.nombre,
        before,
        after,
      });
    }
  }

  if (updates.length === 0) {
    console.log("No hay rutas de imagen para corregir.");
    return;
  }

  console.log(`Se detectaron ${updates.length} productos con rutas a corregir.`);
  for (const item of updates) {
    console.log(`- #${item.id} ${item.nombre}`);
    console.log(`  imagen: ${item.before.imagen} -> ${item.after.imagen}`);
    console.log(`  imagenes: ${JSON.stringify(item.before.imagenes)} -> ${JSON.stringify(item.after.imagenes)}`);
  }

  if (dryRun) {
    console.log("Modo dry-run: no se aplicaron cambios en Supabase.");
    return;
  }

  for (const item of updates) {
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ imagen: item.after.imagen, imagenes: item.after.imagenes })
      .eq("id", item.id);

    if (updateError) {
      throw new Error(`Error al actualizar producto #${item.id}: ${updateError.message}`);
    }
  }

  console.log(`Actualizacion completada. Productos corregidos: ${updates.length}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
