import Link from "next/link";
import { subcategorias } from "@/data/subcategoria";
import { formatSubcategoriaLabel, normalizeCategoriaName } from "@/data/catalogo";

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const decodedCategoria = decodeURIComponent(categoria);
  const normalizedCategoria = normalizeCategoriaName(decodedCategoria);
  const filtradas = subcategorias.filter(
    (s) => normalizeCategoriaName(s.categoria) === normalizedCategoria
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#24170f] via-[#15100c] to-[#090706] text-white">
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

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2 capitalize">
              {decodedCategoria}
            </h1>
            <p className="text-slate-400">
              {filtradas.length} subcategoría{filtradas.length !== 1 ? "s" : ""} disponibles
            </p>
          </div>

          {/* Grid de subcategorías */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((s) => {
              const displayName = formatSubcategoriaLabel(s.nombre);

              return (
                <Link
                  key={s.nombre}
                  href={`/subcategoria/${encodeURIComponent(s.nombre)}`}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 group-hover:from-emerald-600/40 group-hover:to-blue-600/40 transition-all duration-300" />
                  <div className="absolute inset-0 border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all rounded-2xl" />
                  
                  <div className="relative p-6 sm:p-8 min-h-[160px] flex flex-col justify-between backdrop-blur-sm">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-emerald-300 transition">
                        {displayName}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Explorar productos
                      </p>
                    </div>
                  
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mt-4">
                    Ver más
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}