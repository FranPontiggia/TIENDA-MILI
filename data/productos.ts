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

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Centro de planchado",
    precio: 140000,
    descripcion: "Centro de planchado, ideal para poder diferenciar ropa pendiente de planchado con la ya planchada. También te permitirá guardar líquidos y recipientes para planchado, plancha, alargue, etc. Posee dos puertas. Tela super resistente a altas temperaturas. Bisagras metálicas, manijas plásticas. Medidas Ancho 110cm, Alto 88cm, Profundidad 36cm",
    color: "Blanco",
    categoria: "Hogar",
    subcategoria: "Cuidado hogar",
    imagen: "/imagen/centro-planchado.jpeg",
    imagenes: [
      "/imagen/centro-planchado.jpeg",
      "/imagen/centro-planchado-2.jpeg",
      "/imagen/centro-planchado.jpeg",
    ],
    cuotas: [
      { dias: 250, diaria: 1005 },
      { dias: 200, diaria: 1182 },
      { dias: 150, diaria: 1478 },
      { dias: 100, diaria: 1892 },
    ],
  },
  {
    id: 2,
    nombre: "Cafetera de Filtro Atma CA-8133",
    precio: 45000,
    descripcion: "Cafetera de filtro Atma con sistema antigoteo, filtro y portafiltro desmontable.",
    color: "Blanca",
    categoria: "Hogar",
    subcategoria: "Electrohogar",
    imagen: "/imagen/cafetera.jpeg",
    imagenes: [
      "/imagen/cafetera.jpeg",
      "/imagen/cafetera-1.jpeg",
      "/imagen/cafetera-2.jpeg",
    ],
    cuotas: [
      { dias: 200, diaria: 542 },
      { dias: 150, diaria: 678 },
      { dias: 100, diaria: 868 },
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
    imagenes: [
      "/producto/heladera.png",
      "/producto/heladera.png",
      "/producto/heladera.png",
    ],
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
    imagenes: [
      "/producto/balanza.png",
      "/producto/balanza.png",
      "/producto/balanza.png",
    ],
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
    imagenes: [
      "/producto/tv.png",
      "/producto/tv.png",
      "/producto/tv.png",
    ],
    cuotas: [
      { dias: 250, diaria: 1120 },
      { dias: 200, diaria: 1400 },
      { dias: 150, diaria: 1866 },
      { dias: 100, diaria: 2800 },
    ],
  },
];

export async function getProductos(): Promise<Producto[]> {
  return productos;
}
