export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  color: string;
  categoria: string;
  subcategoria: string;
  imagen: string;
  cuotas?: { dias: number; diaria: number }[];
};

export const productos: Producto[] = [
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