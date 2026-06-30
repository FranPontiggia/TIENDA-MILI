import Link from "next/link";
import Image from "next/image";
import { productos } from "@/data/productos";

export default async function SubcategoriaPage({ params }: { params: Promise<{ subcategoria: string }> }) {
  const { subcategoria } = await params;

  const filtrados = productos.filter(
    (p) => p.subcategoria === subcategoria
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold capitalize mb-2">
              {subcategoria}
            </h1>
            <p className="text-slate-400">
              {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""} disponible{filtrados.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((p) => {
              const cuota250 = Math.round(p.precio / 250);

              return (
                <Link
                  key={p.id}
                  href={`/producto/${p.id}`}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 group-hover:from-emerald-600/30 group-hover:to-blue-600/30 transition-all duration-300" />
                  <div className="absolute inset-0 border border-slate-700/50 group-hover:border-emerald-500/50 transition-all rounded-2xl" />

                  <div className="relative overflow-hidden">
                    {/* Imagen */}
                    <div className="relative h-56 bg-slate-800 overflow-hidden">
                      <Image
                        src={p.imagen}
                        alt={p.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="relative p-4 sm:p-6 backdrop-blur-sm">
                      <h2 className="font-bold text-lg sm:text-xl group-hover:text-emerald-300 transition mb-2 line-clamp-2">
                        {p.nombre}
                      </h2>

                      <p className="text-xs text-slate-400 mb-3">
                        {p.descripcion}
                      </p>

                      <div className="mb-4 pb-4 border-t border-slate-700">
                        <p className="text-emerald-400 font-bold text-lg mt-3 mb-1">
                          {cuota250}€/día
                        </p>
                        <p className="text-xs text-slate-400">
                          en 250 cuotas
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm group-hover:text-emerald-300 transition">
                        Ver detalles
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                No hay productos en esta subcategoría todavía
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}