import { productos } from "@/data/productos";
import ClientProductDetail from "./ClientProductDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = productos.find((p) => p.id == Number(id));

  if (!producto) {
    return (
      <div className="p-10 text-white bg-slate-950 min-h-screen">
        Producto no encontrado
      </div>
    );
  }

  return <ClientProductDetail producto={producto} />;
}