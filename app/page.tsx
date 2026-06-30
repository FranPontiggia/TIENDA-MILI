"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { productos, type Producto } from "../data/productos";

const formatMoney = (v: number) => `$${v.toLocaleString("es-AR")}`;

function ProductCard({ producto }: { producto: Producto }) {
  const whatsappUrl = `https://wa.me/5492983541686?text=${encodeURIComponent(
    `Hola, quiero comprar ${producto.nombre}`
  )}`;

  const [selectedCuota, setSelectedCuota] = useState<number | null>(
    producto.cuotas && producto.cuotas.length > 0 ? 0 : null
  );

  const cuota = selectedCuota !== null && producto.cuotas ? producto.cuotas[selectedCuota] : null;
  const cuota250 = Math.round(producto.precio / 250);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-5 p-6">
        <div>
          <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
            Popular
          </p>
          <h2 className="mt-5 text-2xl font-semibold text-slate-900">
            <Link href={`/product/${producto.id}`}>{producto.nombre}</Link>
          </h2>
          <p className="mt-2 text-lg font-semibold text-emerald-700">{formatMoney(cuota250)} por cuota (250 cuotas)</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{producto.descripcion}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-slate-300/80" aria-hidden />
            <p className="text-sm text-slate-600">Color: <span className="font-semibold text-slate-800">{producto.color}</span></p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Comprar por WhatsApp
            </a>
            <Link
              href={`/product/${producto.id}`}
              className="ml-3 inline-flex items-center justify-center rounded-full border border-slate-200/60 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Ver producto
            </Link>
          </div>

          {producto.cuotas && producto.cuotas.length > 0 && (
            <div className="rounded-lg border border-emerald-200/30 bg-emerald-50/60 p-4">
              <p className="mb-3 text-sm text-emerald-800 font-semibold">Selecciona tu plan de pago</p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {producto.cuotas.map((c, idx) => (
                  <button
                    key={c.dias}
                    onClick={() => setSelectedCuota(idx)}
                    className={`rounded-md p-3 text-center transition ${
                      selectedCuota === idx
                        ? "bg-emerald-600 text-white border-2 border-emerald-700"
                        : "bg-white text-slate-900 border-2 border-transparent hover:border-emerald-300"
                    }`}
                  >
                    <p className="text-sm font-medium">{c.dias} días</p>
                    <p className="mt-1 text-xs opacity-75">Cuota diaria</p>
                    <p className="mt-1 text-lg font-semibold">{formatMoney(c.diaria)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_20%)] px-6 py-24 sm:px-10">
        <div className="absolute inset-x-0 top-0 h-60 bg-[linear-gradient(180deg,rgba(15,23,42,0.7),transparent)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 xl:flex-row xl:items-center xl:gap-16">
          <div className="max-w-2xl text-center xl:text-left">
            <span className="inline-flex rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">
              Todo para tu hogar y comercio en cuotas
            </span>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Cuota Marquet
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Descubre productos confiables con ayuda directa por WhatsApp, entrega ágil y atención personalizada para un hogar más cómodo.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#productos"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_-30px_rgba(16,185,129,0.7)] transition hover:bg-emerald-400"
              >
                Ver productos
              </a>
              <a
                href="https://wa.me/5492983541686"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/80 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Chatear por WhatsApp
              </a>
            </div>
          </div>

          <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">
              <p className="text-4xl font-semibold text-white">+150</p>
              <p className="mt-3 text-sm text-slate-300">Clientes satisfechos</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">
              <p className="text-4xl font-semibold text-white">24h</p>
              <p className="mt-3 text-sm text-slate-300">Atención por WhatsApp</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">
              <p className="text-4xl font-semibold text-white">Productos</p>
              <p className="mt-3 text-sm text-slate-300">Selección confiable</p>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-10">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Electrodomésticos</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Productos destacados</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Elegimos lo mejor para tu cocina y tu hogar, con estilo moderno, rendimiento fiable y compra fácil por WhatsApp.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </main>
  );
}
