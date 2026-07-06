import Link from "next/link";
import Image from "next/image";
import { getProductosBySubcategoriaPaginated } from "@/data/productos";
import { formatSubcategoriaLabel } from "@/data/catalogo";

export const dynamic = "force-dynamic";

function parsePage(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export default async function SubcategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ subcategoria: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { subcategoria } = await params;
  const { page } = await searchParams;
  const decodedSubcategoria = decodeURIComponent(subcategoria);
  const currentPage = parsePage(page);
  const { productos: filtrados, total, totalPages, page: safePage } = await getProductosBySubcategoriaPaginated(
    decodedSubcategoria,
    currentPage,
    24
  );

  const displaySubcategoria = formatSubcategoriaLabel(decodedSubcategoria);
  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;
  const subcategoriaHref = `/subcategoria/${encodeURIComponent(decodedSubcategoria)}`;

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
              {displaySubcategoria}
            </h1>
            <p className="text-slate-400">
              {total} producto{total !== 1 ? "s" : ""} disponible{total !== 1 ? "s" : ""}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Pagina {safePage} de {totalPages}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {filtrados.map((p) => {
              const primeraCuota = p.cuotas?.[0];

              return (
                <Link
                  key={p.id}
                  href={`/producto/${p.id}`}
                  className="group flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-500/50"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-800 sm:h-28 sm:w-28">
                    <Image
                      src={p.imagen}
                      alt={p.nombre}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white line-clamp-2">
                      {p.nombre}
                    </h2>
                    <p className="mt-2 text-sm text-emerald-400">
                      {primeraCuota ? `${primeraCuota.dias} cuotas de $${primeraCuota.diaria}` : "En cuotas"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {primeraCuota ? "Ver detalle" : "Ver detalle"}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500/20">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link
                href={hasPrev ? `${subcategoriaHref}?page=${safePage - 1}` : subcategoriaHref}
                aria-disabled={!hasPrev}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  hasPrev
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "cursor-not-allowed bg-slate-900 text-slate-500"
                }`}
              >
                Anterior
              </Link>
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">
                {safePage} / {totalPages}
              </span>
              <Link
                href={hasNext ? `${subcategoriaHref}?page=${safePage + 1}` : `${subcategoriaHref}?page=${safePage}`}
                aria-disabled={!hasNext}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  hasNext
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "cursor-not-allowed bg-slate-900 text-slate-500"
                }`}
              >
                Siguiente
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}