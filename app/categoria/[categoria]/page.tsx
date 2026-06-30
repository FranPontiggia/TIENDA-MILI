import Link from "next/link";
import { subcategorias } from "../../../data/subcategoria";

export default function CategoriaPage({ params }: any) {
  const categoria = params.categoria;

  const filtradas = subcategorias.filter(
    (s) => s.categoria === categoria
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-8">
        {categoria}
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        {filtradas.map((sub) => (
          <Link
            key={sub.nombre}
            href={`/subcategoria/${sub.nombre}`}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h2 className="text-xl font-semibold">
              {sub.nombre}
            </h2>
          </Link>
        ))}

      </div>

    </main>
  );
}