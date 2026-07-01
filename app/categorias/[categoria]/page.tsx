import Link from "next/link";
import { getProductos } from "@/data/productos";

export default async function CategoriaPage({ params }: any) {
  const categoria = params.categoria;
  const productos = await getProductos();

  // Filtrar productos por categoría
  const filtrados = productos.filter(
    (p) => p.categoria === categoria
  );

  // Sacar subcategorías únicas
  const subcategorias = Array.from(
    new Set(filtrados.map((p) => p.subcategoria))
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {categoria}
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {subcategorias.map((sub) => (
          <Link
            key={sub}
            href={`/subcategoria/${sub}`}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h2 className="text-xl font-semibold">{sub}</h2>
          </Link>
        ))}
      </div>

    </main>
  );
}