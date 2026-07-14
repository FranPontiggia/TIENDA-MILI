"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchProduct = {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  subcategoria: string;
  color: string;
  imagen: string;
};

type HeaderProductSearchProps = {
  productos: SearchProduct[];
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function buildSearchIndex(producto: SearchProduct): string {
  return normalizeText(
    [
      producto.id.toString(),
      producto.nombre,
      producto.descripcion,
      producto.categoria,
      producto.subcategoria,
      producto.color,
    ].join(" ")
  );
}

export default function HeaderProductSearch({ productos }: HeaderProductSearchProps) {
  const router = useRouter();
  const desktopRootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const normalizedQuery = normalizeText(query);

  const indexedProducts = useMemo(
    () => productos.map((producto) => ({ producto, index: buildSearchIndex(producto) })),
    [productos]
  );

  const filtered = useMemo(() => {
    if (!normalizedQuery) return [];

    return indexedProducts
      .filter(({ index }) => index.includes(normalizedQuery))
      .slice(0, 8)
      .map(({ producto }) => producto);
  }, [indexedProducts, normalizedQuery]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!desktopRootRef.current) return;
      if (!desktopRootRef.current.contains(event.target as Node)) {
        setDesktopOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setDesktopOpen(false);
      setMobileOpen(false);
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const hasQuery = normalizedQuery.length > 0;
  const shouldShowDesktopResults = desktopOpen && hasQuery;

  function clearSearch() {
    setQuery("");
    setDesktopOpen(false);
  }

  function goToFirstResult() {
    const first = filtered[0];
    if (!first) return;

    setDesktopOpen(false);
    setMobileOpen(false);
    setQuery("");
    router.push(`/producto/${first.id}`);
  }

  return (
    <>
      <div ref={desktopRootRef} className="relative hidden w-full max-w-md md:block">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>

        <input
          type="search"
          value={query}
          onFocus={() => setDesktopOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setDesktopOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              goToFirstResult();
            }
          }}
          placeholder="Buscar productos..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 pl-10 pr-20 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
        />

        {hasQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            aria-label="Limpiar búsqueda"
          >
            Limpiar
          </button>
        )}

        {shouldShowDesktopResults && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-[70vh] overflow-auto rounded-2xl border border-slate-700/90 bg-slate-950/95 p-2 shadow-2xl shadow-black/50">
            <p className="px-2 pb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {filtered.length > 0
                ? `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}`
                : "Sin coincidencias"}
            </p>

            {filtered.length > 0 ? (
              <div className="grid gap-2">
                {filtered.map((producto) => (
                  <Link
                    key={producto.id}
                    href={`/producto/${producto.id}`}
                    onClick={() => {
                      setQuery("");
                      setDesktopOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-900/70 p-2 transition hover:border-emerald-400/40 hover:bg-slate-900"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="48px"
                        quality={70}
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{producto.nombre}</p>
                      <p className="truncate text-xs text-slate-400">
                        {producto.categoria} · {producto.subcategoria}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-2 py-3 text-sm text-slate-400">No se encontraron productos.</p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex h-10 min-w-[150px] items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 text-sm text-slate-300 transition hover:border-emerald-400/60 hover:text-emerald-300 md:hidden"
        aria-label="Abrir buscador"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 shrink-0">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="truncate text-left">Buscar producto...</span>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/70 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="flex h-[72dvh] w-full flex-col rounded-t-3xl border border-slate-700 bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-slate-700" />
            <div className="flex items-center gap-3 border-b border-slate-800 p-4">
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    goToFirstResult();
                  }
                }}
                placeholder="Buscar por nombre, categoría, ID..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
              />
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-lg border border-slate-700 px-2 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-300"
                >
                  Limpiar
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-auto p-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {hasQuery ? (
                filtered.length > 0 ? (
                  <div className="grid gap-2">
                    <p className="px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
                    </p>
                    {filtered.map((producto) => (
                      <Link
                        key={`mobile-${producto.id}`}
                        href={`/producto/${producto.id}`}
                        onClick={() => {
                          setMobileOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                          <Image
                            src={producto.imagen}
                            alt={producto.nombre}
                            fill
                            sizes="56px"
                            quality={70}
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{producto.nombre}</p>
                          <p className="truncate text-xs text-slate-400">
                            {producto.categoria} · {producto.subcategoria}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300">ID {producto.id}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-4 text-sm text-slate-400">No hay resultados para esta búsqueda.</p>
                )
              ) : (
                <p className="px-2 py-4 text-sm text-slate-500">Escribí para empezar a buscar productos.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
