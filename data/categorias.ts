export type Subcategoria = {
  nombre: string;
};

export type Categoria = {
  nombre: string;
  subcategorias: Subcategoria[];
};

export const categorias: Categoria[] = [
  {
    nombre: "Hogar",
    subcategorias: [
      { nombre: "Cuidado del hogar" },
      { nombre: "Electrohogar" },
      { nombre: "TV y Video" },
      { nombre: "Bazar" },
      { nombre: "Sábanas y Colchones" },
      { nombre: "Juguetes" },
      { nombre: "Tecno" },
      { nombre: "Música" },
      { nombre: "Celulares" },
      { nombre: "Trabajo en casa" },
      { nombre: "Aire fresco" },
      { nombre: "Patio" },
      { nombre: "Cuidado personal" },
    ],
  },
  {
    nombre: "Comercio",
    subcategorias: [
      { nombre: "Accesorios de comercio" },
      { nombre: "Heladeras comerciales" },
      { nombre: "Panadería y Rotisería" },
      { nombre: "Balanzas" },
      { nombre: "Máquinas de cortar" },
      { nombre: "Heladeras verticales" },
      { nombre: "Freezers" },
    ],
  },
];