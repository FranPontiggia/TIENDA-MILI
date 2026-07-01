import { productsTable, supabase } from "@/lib/supabase";

export const supabaseConfigured = Boolean(supabase);

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

const productosBase: Producto[] = [
  {
    id: 1,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    color: "Blanco",
    categoria: "Hogar",
    subcategoria: "Electrohogar",
    imagen: "/producto/lavarropa.png",
    cuotas: [
      { dias: 250, diaria: 480 },
      { dias: 200, diaria: 600 },
      { dias: 150, diaria: 800 },
      { dias: 100, diaria: 1200 },
    ],
  },
  {
    id: 2,
    nombre: "Pava eléctrica",
    precio: 45000,
    descripcion: "Pava eléctrica de 1.5L con apagado automático.",
    color: "Acero",
    categoria: "Hogar",
    subcategoria: "Cuidado personal",
    imagen: "/producto/pava.png",
    cuotas: [
      { dias: 250, diaria: 180 },
      { dias: 200, diaria: 225 },
      { dias: 150, diaria: 300 },
      { dias: 100, diaria: 450 },
    ],
  },
  {
    id: 3,
    nombre: "Heladera vertical comercial",
    precio: 350000,
    descripcion: "Heladera ideal para negocios con gran capacidad.",
    color: "Blanco",
    categoria: "Comercio",
    subcategoria: "Heladeras comerciales",
    imagen: "/producto/heladera.png",
    cuotas: [
      { dias: 250, diaria: 1400 },
      { dias: 200, diaria: 1750 },
      { dias: 150, diaria: 2330 },
      { dias: 100, diaria: 3500 },
    ],
  },
  {
    id: 4,
    nombre: "Balanza digital",
    precio: 80000,
    descripcion: "Balanza precisa para comercio.",
    color: "Negro",
    categoria: "Comercio",
    subcategoria: "Balanzas",
    imagen: "/producto/balanza.png",
    cuotas: [
      { dias: 250, diaria: 320 },
      { dias: 200, diaria: 400 },
      { dias: 150, diaria: 533 },
      { dias: 100, diaria: 800 },
    ],
  },
  {
    id: 5,
    nombre: "Smart TV 43\"",
    precio: 280000,
    descripcion: "Televisor Smart con apps integradas.",
    color: "Negro",
    categoria: "Hogar",
    subcategoria: "TV y Video",
    imagen: "/producto/tv.png",
    cuotas: [
      { dias: 250, diaria: 1120 },
      { dias: 200, diaria: 1400 },
      { dias: 150, diaria: 1866 },
      { dias: 100, diaria: 2800 },
    ],
  },
];

export const productos: Producto[] = productosBase;

function toNumber(value: unknown, fallback = 0): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeCuotas(raw: unknown, precio: number): Producto["cuotas"] {
  if (Array.isArray(raw)) {
    const cuotas = raw
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const dias = toNumber(record.dias);
        const diaria = toNumber(record.diaria);
        if (!dias || !diaria) return null;
        return { dias, diaria };
      })
      .filter(Boolean) as { dias: number; diaria: number }[];

    if (cuotas.length > 0) return cuotas;
  }

  return [250, 200, 150, 100].map((dias) => ({ dias, diaria: Math.round(precio / dias) }));
}

function normalizeImages(raw: unknown, fallback: string): string[] {
  if (Array.isArray(raw)) {
    const images = raw
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    if (images.length > 0) return images;
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [fallback];

    const parsed = trimmed.startsWith("[") ? (() => {
      try {
        const parsedValue = JSON.parse(trimmed);
        if (Array.isArray(parsedValue)) {
          const images = parsedValue.map((item) => String(item).trim()).filter(Boolean);
          if (images.length > 0) return images;
        }
      } catch {
        // ignore and fall back to split logic
      }
      return null;
    })() : null;

    if (parsed) return parsed;

    const images = trimmed
      .split(/,|\||;/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (images.length > 0) return images;
  }

  return fallback ? [fallback] : [];
}

function normalizeProducto(row: Record<string, unknown>): Producto {
  const imagen = String(row.imagen ?? row.image ?? row.imagen_url ?? "/producto/default.png");
  const imagenes = normalizeImages(row.imagenes ?? row.images ?? row.fotos ?? row.gallery ?? row.imagen ?? row.image, imagen);

  return {
    id: toNumber(row.id ?? row.product_id ?? row.productId),
    nombre: String(row.nombre ?? row.name ?? row.title ?? "Producto"),
    precio: toNumber(row.precio ?? row.price ?? row.precio_total ?? row.total),
    descripcion: String(row.descripcion ?? row.description ?? ""),
    color: String(row.color ?? row.color_producto ?? ""),
    categoria: String(row.categoria ?? row.category ?? "Hogar"),
    subcategoria: String(row.subcategoria ?? row.subcategory ?? "General"),
    imagen: imagenes[0] ?? imagen,
    imagenes,
    cuotas: normalizeCuotas(row.cuotas ?? row.plans ?? row.plan_de_pagos, toNumber(row.precio ?? row.price ?? row.precio_total ?? row.total)),
  };
}

export async function getProductos(): Promise<Producto[]> {
  if (!supabase) return productosBase;

  try {
    const { data, error } = await supabase.from(productsTable).select("*").order("id", { ascending: true });

    if (error || !data) {
      return productosBase;
    }

    return data.map((row) => normalizeProducto(row as Record<string, unknown>));
  } catch {
    return productosBase;
  }
}