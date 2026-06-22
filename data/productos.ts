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
    nombre: "Microondas 20L",
    precio: 45000,
    descripcion: "Microondas compacto de 20L con funciones de descongelado y grill.",
    imagen: "/producto/lavarropa.png",
  },
];