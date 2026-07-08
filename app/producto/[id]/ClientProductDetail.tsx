"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Producto } from "@/data/productos";

const formatMoney = (v: number) => `$${v.toLocaleString("es-AR")}`;

export default function ClientProductDetail({ producto }: { producto: Producto }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [manualZoom, setManualZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const lastTouchTimestampRef = useRef(0);

  const cuotas = producto.cuotas || [];
  const hasCuotas = cuotas.length > 0;

  const images = (producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : [producto.imagen]).filter(Boolean);
  const currentImage = images[activeImageIdx] || producto.imagen;
  const zoomActive = manualZoom;

  const selected = cuotas[selectedIdx];
  const whatsapp = `https://wa.me/5492983541686?text=${encodeURIComponent(
    hasCuotas && selected
      ? `Hola, quiero comprar ${producto.nombre} - Plan: ${selected.dias} cuotas a $${selected.diaria} por día`
      : `Hola, quiero consultar por ${producto.nombre}`
  )}`;

  useEffect(() => {
    setManualZoom(false);
    setZoomOrigin("50% 50%");
  }, [activeImageIdx]);

  function handleImagePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!manualZoom) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  function handleImagePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;

    const now = Date.now();
    const tapDelta = now - lastTouchTimestampRef.current;
    if (tapDelta > 0 && tapDelta < 300) {
      setManualZoom((value) => !value);
      lastTouchTimestampRef.current = 0;
      return;
    }

    lastTouchTimestampRef.current = now;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Imagen */}
            <div className="flex items-start">
              <div className="w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                <div
                  className="aspect-square relative overflow-hidden"
                  onPointerMove={handleImagePointerMove}
                  onPointerDown={handleImagePointerDown}
                >
                  <Image
                    src={currentImage}
                    alt={producto.nombre}
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    quality={72}
                    priority
                    style={{ transformOrigin: zoomOrigin }}
                    className={`object-cover transition duration-200 ${zoomActive ? "scale-[2.2]" : "scale-100"}`}
                  />
                  <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {zoomActive ? "Zoom x2 activo" : "Activá zoom o hacé doble toque"}
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="border-t border-slate-700 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        ← Anterior
                      </button>
                      <p className="text-sm text-slate-400">
                        {activeImageIdx + 1} / {images.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        Siguiente →
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setManualZoom((value) => !value)}
                      className="mb-3 rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      {manualZoom ? "Desactivar zoom" : "Activar zoom"}
                    </button>

                    <div className="flex gap-2 overflow-x-auto">
                      {images.map((img, idx) => (
                        <button
                          key={`${img}-${idx}`}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
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

            {/* Info */}
            <div>
              {/* Título */}
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {producto.nombre}
              </h1>

              {/* Color y Descripción */}
              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-3">
                  <span className="font-semibold text-white">Color:</span> {producto.color}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              {/* Planes de Pago - Acordeón */}
              {hasCuotas && selected ? (
                <>
                  <h2 className="text-xl font-bold mb-4">Elegi tu plan de pago</h2>

                  <div className="rounded-lg border border-slate-700 overflow-hidden mb-8">
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800 transition border-b border-slate-700"
                    >
                      <div className="text-left">
                        <p className="text-xs text-slate-400 font-semibold">PLAN SELECCIONADO</p>
                        <p className="font-bold text-lg mt-1 text-white">
                          {selected.dias} cuotas de {formatMoney(selected.diaria)}
                        </p>
                        <p className="text-emerald-400 font-semibold">Precio por cuota</p>
                      </div>
                      <svg
                        className={`w-6 h-6 text-slate-400 transition-transform flex-shrink-0 ${
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
                            className={`w-full flex items-center justify-between p-4 border-t border-slate-700 transition text-left ${
                              selectedIdx === idx
                                ? "bg-emerald-600/20 border-emerald-500/30"
                                : "hover:bg-slate-900"
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-lg">{c.dias} cuotas de {formatMoney(c.diaria)}</p>
                              <p className="text-sm text-slate-400 mt-1">
                                Total: {formatMoney(c.diaria * c.dias)}
                              </p>
                            </div>
                            {selectedIdx === idx && (
                              <div className="ml-4 flex-shrink-0 rounded-full bg-emerald-500/15 p-2 text-emerald-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="mb-8 rounded-lg border border-slate-700 bg-slate-900/40 p-4 text-slate-300">
                  Este producto no tiene planes de cuotas cargados todavia. Podes consultarnos por WhatsApp para recibir opciones de pago.
                </div>
              )}

              {/* Botón WhatsApp */}
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
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
