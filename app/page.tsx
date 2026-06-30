import Link from "next/link";
import { categorias } from "../data/categoria";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-10">
        Cuota Market
      </h1>

      <h2 className="text-2xl mb-6">
        Elegí una categoría
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {categorias.map((cat) => (
          <Link
            key={cat.nombre}
            href={`/categoria/${cat.nombre}`}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h3 className="text-xl font-bold">{cat.nombre}</h3>
            <p className="text-sm text-slate-400 mt-2">
              Ver subcategorías
            </p>
          </Link>
        ))}

      </div>

    </main>
  );
}