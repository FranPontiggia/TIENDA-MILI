import { productsTable, supabase } from "../lib/supabase";
import { areSameSubcategoria, getSubcategoriaVariants, normalizeCategoriaName } from "./catalogo";
import localProducts from "../products-import.json";

type ProductsSourceMode = "supabase-first" | "supabase-only" | "local-only";

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
  subcategoría?: string | null;
};

export type PaginatedProductos = {
  productos: Producto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function getProductsSourceMode(): ProductsSourceMode {
  const source = (process.env.PRODUCTS_SOURCE ?? "supabase-first").toLowerCase().trim();

  if (source === "supabase-only" || source === "local-only") {
    return source;
  }

  return "supabase-first";
}

const productsSourceMode = getProductsSourceMode();

function isSupabaseOnlyMode(): boolean {
  return productsSourceMode === "supabase-only";
}

function isLocalOnlyMode(): boolean {
  return productsSourceMode === "local-only";
}

function normalizeCategoriaLabel(value: string): string {
  const normalized = normalizeCategoriaName(value);

  if (normalized === "hogar") return "Hogar";
  if (normalized === "comercio") return "Comercio";
  return value;
}

function getSupabaseRequiredError(context: string): Error {
  return new Error(
    `${context}: PRODUCTS_SOURCE=supabase-only requiere NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY validas.`
  );
}

function toString(value: unknown): string {
  if (typeof value !== "string") return "";

  return value.trim().replace(/^['"]|['"]$/g, "");
}

function normalizeImagePath(value: unknown): string {
  const normalized = toString(value);
  if (!normalized) return "";

  // Repair common import issues: spaces after /imagen/ and missing file extension.
  const withoutExtraSpaces = normalized.replace(/^\/imagen\/\s+/, "/imagen/").trim();

  if (withoutExtraSpaces.startsWith("/imagen/") && !/\.[a-zA-Z0-9]+$/.test(withoutExtraSpaces)) {
    return `${withoutExtraSpaces}.jpeg`;
  }

  return withoutExtraSpaces;
}

function toNumber(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized = value
    .map((item) => normalizeImagePath(item))
    .filter((item): item is string => item !== "");

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

function toProducto(row: ProductoRow): Producto {
  const record = row as Record<string, unknown>;

  return {
    id: toNumber(record.id),
    nombre: toString(record.nombre),
    precio: toNumber(record.precio),
    descripcion: toString(record.descripcion),
    color: toString(record.color),
    categoria: normalizeCategoriaLabel(toString(record.categoria)),
    subcategoria: toString(record.subcategoria ?? record.subcategoría),
    imagen: normalizeImagePath(record.imagen),
    imagenes: toStringArray(record.imagenes),
    cuotas: toCuotas(record.cuotas),
  };
}

function sanitizePage(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

function sanitizePageSize(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 24;
  return Math.min(Math.floor(value), 60);
}

function getLocalProductos(): Producto[] {
  return ((localProducts as ProductoRow[] | null | undefined) ?? [])
    .map(toProducto)
    .filter((producto) => producto.id > 0);
}

export async function getProductos(): Promise<Producto[]> {
  if (isLocalOnlyMode()) {
    return getLocalProductos();
  }

  if (!supabase) {
    if (isSupabaseOnlyMode()) {
      throw getSupabaseRequiredError("getProductos");
    }

    return getLocalProductos();
  }

  const { data, error } = await supabase
    .from(productsTable)
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    if (isSupabaseOnlyMode()) {
      throw new Error(`getProductos: no se pudo leer Supabase (${error.message}).`);
    }

    console.error("Error al obtener productos desde Supabase:", error.message);
    return getLocalProductos();
  }

  return (data as ProductoRow[] | null | undefined ?? []).map(toProducto).filter((producto) => producto.id > 0);
}

export async function getProductosDestacados(limit = 6): Promise<Producto[]> {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 24));
  const productos = await getProductos();
  const rowSize = 2;

  const withText = productos.map((producto) => ({
    producto,
    nombre: normalizeSearchText(producto.nombre),
    subcategoria: normalizeSearchText(producto.subcategoria),
  }));

  const iphones = withText
    .filter((item) => item.nombre.includes("iphone"))
    .map((item) => item.producto)
    .sort((a, b) => b.id - a.id);

  const recientes = [...productos].sort((a, b) => b.id - a.id);

  const cuidadoHogar = withText
    .filter((item) => item.subcategoria.includes("cuidado del hogar") || item.subcategoria.includes("cuidado hogar"))
    .map((item) => item.producto)
    .sort((a, b) => b.id - a.id);

  const electrohogar = withText
    .filter((item) => item.subcategoria.includes("electrohogar"))
    .map((item) => item.producto)
    .sort((a, b) => b.id - a.id);

  const seleccionados: Producto[] = [];
  const vistos = new Set<number>();

  const addFromGroup = (grupo: Producto[], maxItems: number): void => {
    let added = 0;

    for (const producto of grupo) {
      if (seleccionados.length >= safeLimit || added >= maxItems) break;
      if (vistos.has(producto.id)) continue;

      seleccionados.push(producto);
      vistos.add(producto.id);
      added += 1;
    }
  };

  // Orden por filas mobile: 1) iPhone, 2) recientes, 3) cuidado del hogar, 4) electrohogar.
  addFromGroup(iphones, rowSize);
  addFromGroup(recientes, rowSize);
  addFromGroup(cuidadoHogar, rowSize);
  addFromGroup(electrohogar, rowSize);

  // Completa con los mas recientes si algun bloque no llega a 2 productos.
  addFromGroup(recientes, safeLimit);

  return seleccionados.slice(0, safeLimit);
}

export async function getProductosDestacadosPorCategoria(categoria: string, limit = 4): Promise<Producto[]> {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 24));
  const normalizedCategoria = normalizeCategoriaName(categoria);
  const productos = await getProductos();

  return [...productos]
    .filter((producto) => normalizeCategoriaName(producto.categoria) === normalizedCategoria)
    .sort((a, b) => b.id - a.id)
    .slice(0, safeLimit);
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export async function getProductosDestacadosCurados(categoria: string, limit = 4): Promise<Producto[]> {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 24));
  const normalizedCategoria = normalizeCategoriaName(categoria);
  const productos = await getProductos();
  const productosCategoria = productos.filter(
    (producto) => normalizeCategoriaName(producto.categoria) === normalizedCategoria
  );

  const withText = productosCategoria.map((producto) => ({
    producto,
    nombre: normalizeSearchText(producto.nombre),
    subcategoria: normalizeSearchText(producto.subcategoria),
  }));

  const celulares = withText
    .filter((item) => item.subcategoria.includes("celular"))
    .map((item) => item.producto)
    .sort((a, b) => b.id - a.id);

  const perfumes = withText
    .filter((item) => item.subcategoria.includes("perfume") || item.nombre.includes("perfume"))
    .map((item) => item.producto)
    .sort((a, b) => b.id - a.id);

  const lavarropasSubcategorias = new Set(
    withText.filter((item) => item.nombre.includes("lavarropa")).map((item) => item.subcategoria)
  );

  const categoriaLavarropas = withText
    .filter((item) => lavarropasSubcategorias.has(item.subcategoria))
    .map((item) => item.producto)
    .sort((a, b) => b.id - a.id);

  const grupos = [celulares, perfumes, categoriaLavarropas];
  const seleccionados: Producto[] = [];
  const vistos = new Set<number>();

  for (const grupo of grupos) {
    const primero = grupo.find((producto) => !vistos.has(producto.id));
    if (!primero) continue;
    seleccionados.push(primero);
    vistos.add(primero.id);
  }

  const pool = [...grupos.flat()].sort((a, b) => b.id - a.id);
  for (const producto of pool) {
    if (vistos.has(producto.id)) continue;
    seleccionados.push(producto);
    vistos.add(producto.id);
    if (seleccionados.length >= safeLimit) break;
  }

  if (seleccionados.length < safeLimit) {
    const fallbackCategoria = [...productosCategoria].sort((a, b) => b.id - a.id);
    for (const producto of fallbackCategoria) {
      if (vistos.has(producto.id)) continue;
      seleccionados.push(producto);
      vistos.add(producto.id);
      if (seleccionados.length >= safeLimit) break;
    }
  }

  return seleccionados.slice(0, safeLimit);
}

export async function getProductoById(id: number): Promise<Producto | null> {
  if (!Number.isFinite(id) || id <= 0) return null;

  if (isLocalOnlyMode()) {
    const productos = await getProductos();
    return productos.find((producto) => producto.id === id) ?? null;
  }

  if (!supabase) {
    if (isSupabaseOnlyMode()) {
      throw getSupabaseRequiredError("getProductoById");
    }

    const productos = await getProductos();
    return productos.find((producto) => producto.id === id) ?? null;
  }

  const { data, error } = await supabase.from(productsTable).select("*").eq("id", id).maybeSingle();

  if (error) {
    if (isSupabaseOnlyMode()) {
      throw new Error(`getProductoById: no se pudo leer Supabase (${error.message}).`);
    }

    console.error(`Error al obtener producto ${id}:`, error.message);
    const productos = await getProductos();
    return productos.find((producto) => producto.id === id) ?? null;
  }

  if (!data) return null;

  const producto = toProducto(data as ProductoRow);
  return producto.id > 0 ? producto : null;
}

export async function getProductosBySubcategoriaPaginated(
  subcategoria: string,
  page: number,
  pageSize = 24
): Promise<PaginatedProductos> {
  const safePage = sanitizePage(page);
  const safePageSize = sanitizePageSize(pageSize);

  if (isLocalOnlyMode()) {
    const productos = await getProductos();
    const variants = getSubcategoriaVariants(subcategoria);
    const normalizedVariants = variants.map((item) => item.toLowerCase().trim());
    const filtrados = productos.filter((producto) =>
      normalizedVariants.includes(producto.subcategoria.toLowerCase().trim())
    );
    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const pageClamped = Math.min(safePage, totalPages);
    const start = (pageClamped - 1) * safePageSize;
    const end = start + safePageSize;

    return {
      productos: filtrados.slice(start, end),
      total,
      page: pageClamped,
      pageSize: safePageSize,
      totalPages,
    };
  }

  if (!supabase) {
    if (isSupabaseOnlyMode()) {
      throw getSupabaseRequiredError("getProductosBySubcategoriaPaginated");
    }

    const productos = await getProductos();
    const variants = getSubcategoriaVariants(subcategoria);
    const normalizedVariants = variants.map((item) => item.toLowerCase().trim());
    const filtrados = productos.filter((producto) =>
      normalizedVariants.includes(producto.subcategoria.toLowerCase().trim())
    );
    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const pageClamped = Math.min(safePage, totalPages);
    const start = (pageClamped - 1) * safePageSize;
    const end = start + safePageSize;

    return {
      productos: filtrados.slice(start, end),
      total,
      page: pageClamped,
      pageSize: safePageSize,
      totalPages,
    };
  }

  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize - 1;
  const variants = getSubcategoriaVariants(subcategoria);

  let queryResult = await supabase
    .from(productsTable)
    .select("*", { count: "exact" })
    .in("subcategoria", variants)
    .order("id", { ascending: true })
    .range(start, end);

  if (queryResult.error && /column\s+.*subcategoria\s+does not exist/i.test(queryResult.error.message)) {
    queryResult = await supabase
      .from(productsTable)
      .select("*", { count: "exact" })
      .in("subcategoría", variants)
      .order("id", { ascending: true })
      .range(start, end);
  }

  const { data, error, count } = queryResult;

  if (error) {
    if (isSupabaseOnlyMode()) {
      throw new Error(`getProductosBySubcategoriaPaginated: no se pudo leer Supabase (${error.message}).`);
    }

    console.error("Error al obtener productos paginados por subcategoria:", error.message);
    const productos = await getProductos();
    const normalizedVariants = variants.map((item) => item.toLowerCase().trim());
    const filtrados = productos.filter((producto) =>
      normalizedVariants.includes(producto.subcategoria.toLowerCase().trim())
    );
    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const pageClamped = Math.min(safePage, totalPages);
    const fallbackStart = (pageClamped - 1) * safePageSize;
    const fallbackEnd = fallbackStart + safePageSize;

    return {
      productos: filtrados.slice(fallbackStart, fallbackEnd),
      total,
      page: pageClamped,
      pageSize: safePageSize,
      totalPages,
    };
  }

  const productos = (data as ProductoRow[] | null | undefined ?? []).map(toProducto).filter((producto) => producto.id > 0);
  if (productos.length === 0) {
    const allProductos = await getProductos();
    const filtrados = allProductos.filter((producto) => areSameSubcategoria(producto.subcategoria, subcategoria));
    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const pageClamped = Math.min(safePage, totalPages);
    const fallbackStart = (pageClamped - 1) * safePageSize;
    const fallbackEnd = fallbackStart + safePageSize;

    return {
      productos: filtrados.slice(fallbackStart, fallbackEnd),
      total,
      page: pageClamped,
      pageSize: safePageSize,
      totalPages,
    };
  }

  const total = count ?? productos.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const pageClamped = Math.min(safePage, totalPages);

  return {
    productos,
    total,
    page: pageClamped,
    pageSize: safePageSize,
    totalPages,
  };
}
