import Link from "next/link";
import Image from "next/image";
import { getProductos, supabaseConfigured } from "@/data/productos";

export default async function Home() {
  const productos = await getProductos();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <section className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-400/80 mb-4">
              Tienda Cuotas
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Productos en cuotas para hogar y comercio
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg text-slate-300">
              Cargá tus productos desde Supabase y mostralos automáticamente con un diseño moderno y planes claros.
            </p>
          </section>

          {!supabaseConfigured && (
            <div className="mb-10 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100">
              <p className="font-semibold text-amber-200">Supabase no está configurado</p>
              <p className="mt-2 text-sm sm:text-base text-amber-100">
                Crea <code className="rounded bg-slate-900 px-1 py-0.5">.env.local</code> con tus valores
                <span className="font-semibold"> NEXT_PUBLIC_SUPABASE_URL</span> y
                <span className="font-semibold"> NEXT_PUBLIC_SUPABASE_ANON_KEY</span>, luego reinicia el servidor.
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                href={`/producto/${producto.id}`}
                className="group overflow-hidden rounded-[28px] border border-slate-700/70 bg-slate-950/90 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {producto.categoria} · {producto.subcategoria}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white line-clamp-2">
                    {producto.nombre}
                  </h2>
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
        </div>
      </div>
    </main>
  );
}
