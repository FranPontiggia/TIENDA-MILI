import Link from "next/link";
import Image from "next/image";
import { categorias } from "@/data/categoria";
import { subcategorias } from "@/data/subcategoria";
import { formatSubcategoriaLabel } from "@/data/catalogo";
import { getProductosDestacados } from "@/data/productos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const destacados = await getProductosDestacados(6);
  const catalogoPorCategoria = categorias.map((categoria) => {
    const items = subcategorias.filter((subcategoria) => subcategoria.categoria === categoria.nombre);
    return { categoria: categoria.nombre, items };
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#24170f] via-[#15100c] to-[#090706] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Cuota Market
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-slate-300">
            Todo para tu hogar y comercio en cuotas.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categorias.map((categoria) => (
              <Link
                key={categoria.nombre}
                href={`/categoria/${encodeURIComponent(categoria.nombre)}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-200"
              >
                <span aria-hidden>{categoria.nombre === "Hogar" ? "🏠" : "🏬"}</span>
                {categoria.nombre}
              </Link>
            ))}
            <Link
              href="/solicitar-efectivo"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300/70 hover:bg-emerald-500/20"
            >
              Solicitar efectivo
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </header>

        <section className="mb-12">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Productos destacados</p>
              <h2 className="text-3xl font-bold text-white">Lo más elegido</h2>
            </div>
            <p className="text-sm text-slate-400">Seleccioná un producto para ver sus cuotas.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {destacados.map((producto, index) => {
              const primeraCuota = producto.cuotas?.[0];
              const isCafetera = producto.nombre.toLowerCase().includes("cafetera");

              return (
                <Link
                  key={producto.id}
                  href={`/producto/${producto.id}`}
                  className={`group overflow-hidden rounded-[28px] border shadow-xl shadow-black/20 transition hover:-translate-y-1 ${
                    isCafetera
                      ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-slate-900/90 hover:border-emerald-400/70"
                      : "border-slate-700/70 bg-slate-900/80 hover:border-emerald-400/40"
                  }`}
                >
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                      quality={75}
                      priority={index < 2}
                      className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {producto.categoria} · {producto.subcategoria}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-white line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-3">
                      {producto.descripcion}
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <span className="text-emerald-400 font-bold text-xl">
                        {primeraCuota
                          ? `${primeraCuota.dias} cuotas de $${primeraCuota.diaria}`
                          : "En cuotas"}
                      </span>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                      Cuotas
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Explorar categorías</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">rápido</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {catalogoPorCategoria.map(({ categoria, items }) => (
              <Link
                key={categoria}
                href={`/categoria/${encodeURIComponent(categoria)}`}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 transition hover:border-emerald-400/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-sm">
                      {categoria === "Hogar" ? "🏠" : "🏬"}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-white">{categoria}</p>
                      <p className="text-xs text-slate-400">{items.length} subcategorías</p>
                    </div>
                  </div>
                  <span className="text-sm text-emerald-300 transition group-hover:translate-x-1">→</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {items.slice(0, 4).map((item) => (
                    <span
                      key={`${categoria}-${item.nombre}`}
                      className="rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-[11px] text-slate-300"
                    >
                      {formatSubcategoriaLabel(item.nombre)}
                    </span>
                  ))}
                  {items.length > 4 && (
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">
                      +{items.length - 4}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
