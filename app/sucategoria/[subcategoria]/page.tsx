import Link from "next/link";
import Image from "next/image";
import { productos } from "@/data/productos";

export default function SubcategoriaPage({ params }: any) {
  const subcategoria = params.subcategoria;

  const filtrados = productos.filter(
    (p) => p.subcategoria === subcategoria
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-8 capitalize">
        {subcategoria}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {filtrados.map((p) => {
          const cuota250 = Math.round(p.precio / 250);

          return (
            <Link
              key={p.id}
              href={`/producto/${p.id}`}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >

              {/* Imagen */}
              <div className="relative h-48">
                <Image
                  src={p.imagen}
                  alt={p.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h2 className="font-bold text-lg">{p.nombre}</h2>

                <p className="text-emerald-400 font-semibold mt-2">
                  Desde ${cuota250} por día (250 cuotas)
                </p>
              </div>

            </Link>
          );
        })}

      </div>

    </main>
  );
}