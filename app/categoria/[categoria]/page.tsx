import Link from "next/link";
import Image from "next/image";
import { subcategorias } from "@/data/subcategoria";
import { formatSubcategoriaLabel, normalizeCategoriaName } from "@/data/catalogo";
import { getProductosDestacadosCurados } from "@/data/productos";
import BackToPreviousButton from "@/app/components/BackToPreviousButton";

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const decodedCategoria = decodeURIComponent(categoria);
  const normalizedCategoria = normalizeCategoriaName(decodedCategoria);
  const filtradas = subcategorias.filter(
    (s) => normalizeCategoriaName(s.categoria) === normalizedCategoria
  );
  const destacados = await getProductosDestacadosCurados(decodedCategoria, 4);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#24170f] via-[#15100c] to-[#090706] text-white">
      <div className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-6 flex items-center gap-3">
              <BackToPreviousButton className="inline-flex items-center gap-2 text-slate-400 transition hover:text-emerald-400" />
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
              >
                Inicio
              </Link>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2 capitalize">
              {decodedCategoria}
            </h1>
            <p className="text-slate-400">
              {filtradas.length} subcategoría{filtradas.length !== 1 ? "s" : ""} disponibles
            </p>
          </div>

          {/* Grid de subcategorías */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtradas.map((s) => {
              const displayName = formatSubcategoriaLabel(s.nombre);

              return (
                <Link
                  key={s.nombre}
                  href={`/subcategoria/${encodeURIComponent(s.nombre)}`}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 group-hover:from-emerald-600/40 group-hover:to-blue-600/40 transition-all duration-300" />
                  <div className="absolute inset-0 rounded-xl border border-emerald-500/20 transition-all group-hover:border-emerald-400/40" />
                  
                  <div className="relative flex min-h-[62px] items-center justify-between p-2.5 backdrop-blur-sm sm:min-h-[70px] sm:p-3">
                    <h2 className="pr-2 text-xs font-bold leading-tight text-white transition group-hover:text-emerald-300 sm:text-sm">
                      {displayName}
                    </h2>
                    <svg
                      className="h-3 w-3 shrink-0 text-emerald-300/90 transition group-hover:translate-x-0.5 group-hover:text-emerald-200 sm:h-3.5 sm:w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
              </Link>
            );
            })}
          </div>

          {destacados.length > 0 && (
            <section className="mt-10 sm:mt-12">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-lg font-semibold text-white sm:text-xl">Productos destacados</h2>
                <Link href="/" className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 sm:text-sm">
                  Ver todos
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                {destacados.map((producto) => (
                  <Link
                    key={producto.id}
                    href={`/producto/${producto.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 transition hover:border-emerald-500/40"
                  >
                    <div className="relative aspect-square w-full bg-gradient-to-br from-white via-slate-50 to-slate-100">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        quality={60}
                        className="object-contain p-3 transition duration-300 group-hover:scale-105 lg:p-4"
                      />
                    </div>
                    <div className="flex flex-1 items-start p-2.5 sm:p-3 lg:p-4">
                      <p className="line-clamp-2 text-xs font-medium leading-snug text-white sm:text-sm lg:text-base">
                        {producto.nombre}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}