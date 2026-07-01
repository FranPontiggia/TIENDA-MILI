import Link from "next/link";
import { categorias } from "@/data/categoria";
import { getProductos, supabaseConfigured } from "@/data/productos";

export default async function Home() {
  const productos = await getProductos();
  const destacados = productos.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
        <header className="mb-16 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-400/80 mb-4">
            Tienda Cuotas
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Elegí tu categoría
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg text-slate-300">
            Comenzá desde el inicio con Hogar o Comercio y encontrá rápidamente productos en cuotas.
          </p>
        </header>

        {!supabaseConfigured && (
          <div className="mb-14 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-100">
            <p className="font-semibold text-amber-200">Supabase no está configurado</p>
            <p className="mt-2 text-sm sm:text-base text-amber-100">
              Crea <code className="rounded bg-slate-900 px-1 py-0.5">.env.local</code> con
              <span className="font-semibold"> NEXT_PUBLIC_SUPABASE_URL</span> y
              <span className="font-semibold"> NEXT_PUBLIC_SUPABASE_ANON_KEY</span>, luego reinicia el servidor.
            </p>
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2 mb-16">
          {categorias.map((categoria) => (
            <Link
              key={categoria.nombre}
              href={`/categoria/${encodeURIComponent(categoria.nombre)}`}
              className="group relative overflow-hidden rounded-[28px] border border-slate-700/80 bg-slate-900/90 p-10 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/40"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-3xl text-emerald-300">
                {categoria.nombre === "Hogar" ? "🏠" : "🏬"}
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-3">
                Categoría
              </p>
              <h2 className="text-4xl font-semibold text-white capitalize">
                {categoria.nombre}
              </h2>
              <p className="mt-4 text-slate-400 leading-7">
                Ver productos y subcategorías para {categoria.nombre.toLowerCase()}.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-emerald-400 font-semibold">
                Ir a {categoria.nombre}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mb-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Productos destacados</p>
              <h2 className="text-3xl font-bold text-white">Lo más elegido</h2>
            </div>
            <p className="text-sm text-slate-400">Seleccioná un producto para ver sus cuotas.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {destacados.map((producto) => (
              <Link
                key={producto.id}
                href={`/producto/${producto.id}`}
                className="group overflow-hidden rounded-[28px] border border-slate-700/70 bg-slate-900/80 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
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
                      ${producto.precio}
                    </span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                      Ver producto
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
