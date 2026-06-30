export type Subcategoria = {
  nombre: string;
  categoria: "Hogar" | "Comercio";
};

export const subcategorias: Subcategoria[] = [
  { nombre: "Cuidado del hogar", categoria: "Hogar" },
  { nombre: "Electrohogar", categoria: "Hogar" },
  { nombre: "TV y Video", categoria: "Hogar" },
  { nombre: "Bazar", categoria: "Hogar" },
  { nombre: "Sábanas y Colchones", categoria: "Hogar" },
  { nombre: "Juguetes", categoria: "Hogar" },
  { nombre: "Tecno", categoria: "Hogar" },
  { nombre: "Música", categoria: "Hogar" },
  { nombre: "Celulares", categoria: "Hogar" },
  { nombre: "Trabajo en casa", categoria: "Hogar" },
  { nombre: "Aire fresco", categoria: "Hogar" },
  { nombre: "Patio", categoria: "Hogar" },
  { nombre: "Cuidado personal", categoria: "Hogar" },

  { nombre: "Accesorios de comercio", categoria: "Comercio" },
  { nombre: "Heladeras comerciales", categoria: "Comercio" },
  { nombre: "Panadería y Rotisería", categoria: "Comercio" },
  { nombre: "Balanzas", categoria: "Comercio" },
  { nombre: "Máquinas de cortar", categoria: "Comercio" },
  { nombre: "Heladeras verticales", categoria: "Comercio" },
  { nombre: "Freezers", categoria: "Comercio" },
];