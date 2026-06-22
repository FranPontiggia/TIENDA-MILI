export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  color: string;
  cuotas?: { dias: number; diaria: number }[];
  imagen: string;
};

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    color: "Blanco",
    imagen: "/producto/lavarropa.png",
    cuotas: [
      { dias: 100, diaria: 1200 },
      { dias: 200, diaria: 600 },
      { dias: 300, diaria: 400 },
      { dias: 400, diaria: 300 },
    ],
  },
  {
    id: 2,
    nombre: "pava electrica",
    precio: 45000,
    descripcion: "Pava eléctrica de 1.5L con función de apagado automático.",
    color: "Acero",
    imagen: "",
    cuotas: [
      { dias: 100, diaria: 450 },
      { dias: 200, diaria: 225 },
      { dias: 300, diaria: 150 },
      { dias: 400, diaria: 113 },
    ],
  },
  {
    id: 3,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    color: "Blanco",
    imagen: "/producto/lavarropa.png",
    cuotas: [
      { dias: 100, diaria: 1200 },
      { dias: 200, diaria: 600 },
      { dias: 300, diaria: 400 },
      { dias: 400, diaria: 300 },
    ],
  },
  {
    id: 4,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    color: "Gris",
    imagen: "/producto/lavarropa.png",
    cuotas: [
      { dias: 100, diaria: 1200 },
      { dias: 200, diaria: 600 },
      { dias: 300, diaria: 400 },
      { dias: 400, diaria: 300 },
    ],
  },
  {
    id: 5,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    color: "Negro",
    imagen: "/producto/lavarropa.png",
    cuotas: [
      { dias: 100, diaria: 1200 },
      { dias: 200, diaria: 600 },
      { dias: 300, diaria: 400 },
      { dias: 400, diaria: 300 },
    ],
  },
];