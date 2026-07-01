import { productsTable, supabase } from "../lib/supabase";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  color: string;
  categoria: string;
  subcategoria: string;
  imagen: string;
  imagenes?: string[];
  cuotas?: { dias: number; diaria: number }[];
};

type ProductoRow = {
  id?: number | string | null;
  nombre?: string | null;
  precio?: number | string | null;
  descripcion?: string | null;
  color?: string | null;
  categoria?: string | null;
  subcategoria?: string | null;
  imagen?: string | null;
  imagenes?: unknown;
  cuotas?: unknown;
};

function toString(value: unknown): string {
  if (typeof value !== "string") return "";

  return value.trim().replace(/^['"]|['"]$/g, "");
}

function toNumber(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized = value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  return normalized.length > 0 ? normalized : undefined;
}

function toCuotas(value: unknown): Producto["cuotas"] {
  if (!Array.isArray(value)) return undefined;

  const normalized = value.filter(
    (item): item is { dias: number; diaria: number } =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as { dias?: unknown }).dias === "number" &&
      typeof (item as { diaria?: unknown }).diaria === "number"
  );

  return normalized.length > 0 ? normalized : undefined;
}

export async function getProductos(): Promise<Producto[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(productsTable)
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al obtener productos desde Supabase:", error.message);
    return [];
  }

  return (data as ProductoRow[] | null | undefined ?? []).map((row) => {
    const record = row as Record<string, unknown>;

    return {
      id: toNumber(record.id),
      nombre: toString(record.nombre),
      precio: toNumber(record.precio),
      descripcion: toString(record.descripcion),
      color: toString(record.color),
      categoria: toString(record.categoria),
      subcategoria: toString(record.subcategoria ?? record.subcategoría),
      imagen: toString(record.imagen),
      imagenes: toStringArray(record.imagenes),
      cuotas: toCuotas(record.cuotas),
    };
  });
}
