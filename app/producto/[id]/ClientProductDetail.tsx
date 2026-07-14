"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Producto } from "@/data/productos";
import BackToPreviousButton from "@/app/components/BackToPreviousButton";

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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex items-start">
              <div className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                <div className="relative aspect-square overflow-hidden" style={{ userSelect: "none" }}>
                  <Image
                    src={currentImage}
                    alt={producto.nombre}
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    quality={72}
                    priority
                    className="object-cover transition duration-200"
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
                      {images.map((img, idx) => (
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
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{producto.nombre}</h1>

              <div className="mb-8">
                <p className="mb-3 text-sm text-slate-400">
                  <span className="font-semibold text-white">Color:</span> {producto.color}
                </p>
                <p className="leading-relaxed text-slate-300">{producto.descripcion}</p>
              </div>

              {hasCuotas && selected ? (
                <>
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
                                <p className="mt-1 text-sm text-slate-400">
                                  Total: {formatMoney(c.diaria * c.dias)}
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
                </>
              ) : (
                <div className="mb-8 rounded-lg border border-slate-700 bg-slate-900/40 p-4 text-slate-300">
                  Este producto no tiene planes de cuotas cargados todavia. Podes consultarnos por WhatsApp para
                  recibir opciones de pago.
                </div>
              )}

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
