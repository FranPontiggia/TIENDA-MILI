import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
let filePath = "./products-import.json";
let dryRun = false;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--file") {
    filePath = args[index + 1];
    index += 1;
  } else if (arg === "--dry-run") {
    dryRun = true;
  }
}

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

const normalizedProducts = payload.map((item) => {
  const producto = item;
  const row = {
    nombre: producto.nombre,
    precio: Number(producto.precio ?? 0),
    descripcion: producto.descripcion ?? "",
    color: producto.color ?? "",
    categoria: producto.categoria ?? "Hogar",
    subcategoria: producto.subcategoria ?? "Cuidado del hogar",
    imagen: producto.imagen ?? "",
    imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : [],
    cuotas: Array.isArray(producto.cuotas) ? producto.cuotas : [],
  };

  if (producto.id != null && producto.id !== "") {
    row.id = Number(producto.id);
  }

  return row;
});

if (dryRun) {
  console.log(`Modo de prueba: se insertarían ${normalizedProducts.length} productos en la tabla ${tableName}.`);
  console.log(JSON.stringify(normalizedProducts, null, 2));
  process.exit(0);
}

const { data, error } = await supabase.from(tableName).upsert(normalizedProducts, { onConflict: "id" }).select("id");

if (error) {
  console.error("Error al insertar productos:", error.message);
  process.exit(1);
}

console.log(`Se cargaron ${data?.length ?? 0} productos en Supabase.`);
