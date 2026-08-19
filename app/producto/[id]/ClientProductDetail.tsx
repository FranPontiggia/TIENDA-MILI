"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Producto } from "@/data/productos";
import BackToPreviousButton from "@/app/components/BackToPreviousButton";
import ProductShareButton from "@/app/components/ProductShareButton";

const formatMoney = (v: number) => `$${v.toLocaleString("es-AR")}`;

export default function ClientProductDetail({ producto }: { producto: Producto }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const cuotas = producto.cuotas || [];
  const hasCuotas = cuotas.length > 0;
  const selected = cuotas[selectedIdx];

  const images = (producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : [producto.imagen]).filter(Boolean);
  const currentImage = images[activeImageIdx] || producto.imagen;
  const extraDetailValue = producto.color?.trim() || "";
  const isIphone17ProFrame = /iphone\s*17\s*pro\s*max|iphone\s*17\s*pro|iphone17promax|iphone17pro/i.test(
    `${producto.nombre} ${currentImage}`
  );

  const whatsapp = `https://wa.me/2494690261?text=${encodeURIComponent(
    hasCuotas && selected
      ? `Hola, quiero comprar ${producto.nombre} - Plan: ${selected.dias} cuotas a $${selected.diaria} por día`
      : `Hola, quiero consultar por ${producto.nombre}`
  )}`;

  function selectImage(index: number) {
    setActiveImageIdx(index);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#24170f] via-[#15100c] to-[#090706] text-white">
      <div className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <BackToPreviousButton className="inline-flex items-center gap-2 text-slate-400 transition hover:text-emerald-400" />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
            >
              Inicio
            </Link>
          </div>

          <h1 className="mb-6 text-3xl font-bold sm:text-4xl">{producto.nombre}</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex items-start">
              <div className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                <div className="relative aspect-square overflow-hidden" style={{ userSelect: "none" }}>
                  <div className="absolute right-3 top-3 z-20 flex flex-col items-center gap-2">
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-500 text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition hover:scale-105 hover:bg-emerald-400"
                      aria-label="Comprar por WhatsApp"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.2 1.6 6.03L0 24l6.15-1.61A11.95 11.95 0 0 0 12 24h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.49-8.52zm-8.5 18.5h-.01a9.9 9.9 0 0 1-5.04-1.37l-.36-.21-3.65.96.98-3.56-.24-.37A9.9 9.9 0 0 1 2.02 12c0-5.5 4.48-9.98 10-9.98 2.67 0 5.18 1.04 7.06 2.92A9.93 9.93 0 0 1 22.02 12c0 5.5-4.48 9.98-10 9.98zm5.48-7.48c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.43-1.49-.9-.8-1.5-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.22 1.36.19 1.88.12.57-.08 1.77-.72 2.03-1.41.25-.7.25-1.29.18-1.42-.08-.13-.28-.2-.58-.35z" />
                      </svg>
                    </a>
                    <ProductShareButton
                      productName={producto.nombre}
                      variant="overlay"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition hover:scale-105 hover:text-emerald-600"
                    />
                  </div>
                  <Image
                    src={currentImage}
                    alt={producto.nombre}
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    quality={72}
                    priority
                    className={`transition duration-200 ${
                      isIphone17ProFrame ? "object-contain object-top px-3 pt-4 pb-2" : "object-contain p-4"
                    }`}
                  />
                </div>

                {images.length > 1 && (
                  <div className="border-t border-slate-700 bg-slate-900/80 p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => selectImage(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1)}
                        className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        ← Anterior
                      </button>
                      <p className="text-sm text-slate-400">
                        {activeImageIdx + 1} / {images.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => selectImage(activeImageIdx === images.length - 1 ? 0 : activeImageIdx + 1)}
                        className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        Siguiente →
                      </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                      {images.map((img, idx) => {
                        const isIphone17ProThumb = /iphone\s*17\s*pro\s*max|iphone\s*17\s*pro|iphone17promax|iphone17pro/i.test(
                          `${producto.nombre} ${img}`
                        );

                        return (
                          <button
                            key={`${img}-${idx}`}
                            type="button"
                            onClick={() => selectImage(idx)}
                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                              activeImageIdx === idx ? "border-emerald-400" : "border-slate-700"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`${producto.nombre} ${idx + 1}`}
                              fill
                              sizes="64px"
                              quality={50}
                              className={
                                isIphone17ProThumb ? "object-contain object-top px-1 pt-2 pb-1" : "object-contain p-1"
                              }
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col">
                <div className="order-2 mb-8">
                  <p className="mb-3 min-h-5 text-sm text-slate-400">{extraDetailValue}</p>
                  <p className="leading-relaxed text-slate-300">{producto.descripcion}</p>
                </div>

                {hasCuotas && selected ? (
                  <div className="order-1">
                  <h2 className="mb-4 text-xl font-bold">Elegi tu plan de pago</h2>

                  <div className="mb-8 overflow-hidden rounded-lg border border-slate-700">
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="w-full border-b border-slate-700 bg-slate-900/50 p-4 transition hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="text-xs font-semibold text-slate-400">PLAN SELECCIONADO</p>
                          <p className="mt-1 text-lg font-bold text-white">
                            {selected.dias} cuotas de {formatMoney(selected.diaria)}
                          </p>
                          <p className="font-semibold text-emerald-400">Precio por cuota</p>
                        </div>
                        <svg
                          className={`h-6 w-6 flex-shrink-0 text-slate-400 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </button>

                    {expanded && (
                      <div className="bg-slate-950">
                        {cuotas.map((c, idx) => (
                          <button
                            key={`${c.dias}-${c.diaria}`}
                            onClick={() => {
                              setSelectedIdx(idx);
                              setExpanded(false);
                            }}
                            className={`w-full border-t border-slate-700 p-4 text-left transition ${
                              selectedIdx === idx
                                ? "border-emerald-500/30 bg-emerald-600/20"
                                : "hover:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-lg font-semibold">
                                  {c.dias} cuotas de {formatMoney(c.diaria)}
                                </p>
                              </div>
                              {selectedIdx === idx && (
                                <div className="ml-4 flex-shrink-0 rounded-full bg-emerald-500/15 p-2 text-emerald-400">
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                ) : (
                  <div className="order-1 mb-8 rounded-lg border border-slate-700 bg-slate-900/40 p-4 text-slate-300">
                    Este producto no tiene planes de cuotas cargados todavia. Podes consultarnos por WhatsApp para
                    recibir opciones de pago.
                  </div>
                )}
              </div>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-center font-bold text-white transition hover:scale-105 hover:from-emerald-600 hover:to-emerald-700"
              >
                💬 Comprar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
