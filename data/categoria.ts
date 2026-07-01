export type Subcategoria = {
  nombre: string;
  categoria: "Hogar" | "Comercio";
};

export type Categoria = {
  nombre: string;
};

export const categorias: Categoria[] = [
  { nombre: "Hogar" },
  { nombre: "Comercio" },
];

export const subcategorias: Subcategoria[] = [
  { nombre: "Electrohogar", categoria: "Hogar" },
  { nombre: "TV y Video", categoria: "Hogar" },
  { nombre: "Cuidado personal", categoria: "Hogar" },
  { nombre: "Cuidado hogar", categoria: "Hogar" },
  { nombre: "Bazar", categoria: "Hogar" },
  { nombre: "Heladeras comerciales", categoria: "Comercio" },
  { nombre: "Balanzas", categoria: "Comercio" },
];