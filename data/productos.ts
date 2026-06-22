export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
};

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    imagen: "/producto/lavarropa.png",
  },
  {
    id: 2,
    nombre: "pava electrica",
    precio: 45000,
    descripcion: "Pava eléctrica de 1.5L con función de apagado automático.",
    imagen: "",
  },
  {
    id: 3,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    imagen: "/producto/lavarropa.png",
  },
  {
    id: 4,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    imagen: "/producto/lavarropa.png",
  },
  {
    id: 5,
    nombre: "Lavarropa 6kg",
    precio: 120000,
    descripcion: "Lavarropa eficiente de 6kg, consumo reducido y programas rápidos.",
    imagen: "/producto/lavarropa.png",
  },
];