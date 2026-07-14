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
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [mobileFullscreenOpen, setMobileFullscreenOpen] = useState(false);
  const touchGestureRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{
    distance: number;
    scale: number;
  } | null>(null);
  const lastTapTimestampRef = useRef(0);
  const lastTapPointRef = useRef<{ x: number; y: number } | null>(null);

  const cuotas = producto.cuotas || [];
  const hasCuotas = cuotas.length > 0;

  const images = (producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : [producto.imagen]).filter(Boolean);
  const currentImage = images[activeImageIdx] || producto.imagen;
  const zoomActive = zoomScale > 1.01;

  const selected = cuotas[selectedIdx];
  const backHref = `/subcategoria/${encodeURIComponent(producto.subcategoria)}`;
  const whatsapp = `https://wa.me/5492983541686?text=${encodeURIComponent(
    hasCuotas && selected
      ? `Hola, quiero comprar ${producto.nombre} - Plan: ${selected.dias} cuotas a $${selected.diaria} por día`
      : `Hola, quiero consultar por ${producto.nombre}`
  )}`;

  useEffect(() => {
    if (!mobileFullscreenOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFullscreenOpen]);

  function selectImage(index: number) {
    setActiveImageIdx(index);
    setZoomScale(1);
    setZoomOrigin("50% 50%");
    pinchStartRef.current = null;
  }

  function getPinchDistance() {
    const pointerValues = Array.from(touchGestureRef.current.values());

    if (pointerValues.length < 2) return 0;

    const [first, second] = pointerValues;
    return Math.hypot(second.x - first.x, second.y - first.y);
  }

  function handleImagePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;

    const pointers = touchGestureRef.current;
    const currentPointer = pointers.get(event.pointerId);
    if (!currentPointer) return;

    currentPointer.x = event.clientX;
    currentPointer.y = event.clientY;

    if (pointers.size >= 2) {
      const pointerValues = Array.from(pointers.values());
      const [first, second] = pointerValues;
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const start = pinchStartRef.current;

      if (!start) {
        pinchStartRef.current = {
          distance: distance || 1,
          scale: zoomScale,
        };
        return;
      }

      const nextScale = Math.min(Math.max(start.scale * (distance / start.distance), 1), 4);
      const midpointX = (first.x + second.x) / 2;
      const midpointY = (first.y + second.y) / 2;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = ((midpointX - bounds.left) / bounds.width) * 100;
      const y = ((midpointY - bounds.top) / bounds.height) * 100;

      setZoomScale(nextScale);
      setZoomOrigin(`${x}% ${y}%`);
      return;
    }

    if (zoomScale <= 1) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      setZoomOrigin(`${x}% ${y}%`);
    }
  }

  function handleImagePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;

    event.currentTarget.setPointerCapture(event.pointerId);

    touchGestureRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (touchGestureRef.current.size === 2) {
      pinchStartRef.current = {
        distance: getPinchDistance() || 1,
        scale: zoomScale,
      };
    }
  }

  function handleImagePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;

    const gesture = touchGestureRef.current.get(event.pointerId);
    touchGestureRef.current.delete(event.pointerId);

    if (!gesture) return;

    if (touchGestureRef.current.size < 2) {
      pinchStartRef.current = null;
    }

    const deltaX = event.clientX - gesture.x;
    const deltaY = event.clientY - gesture.y;
    const isSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isSwipe && images.length > 1 && touchGestureRef.current.size === 0) {
      setZoomScale(1);
      setZoomOrigin("50% 50%");

      if (deltaX < 0) {
        selectImage(activeImageIdx === images.length - 1 ? 0 : activeImageIdx + 1);
      } else {
        selectImage(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1);
      }

      lastTapTimestampRef.current = 0;
      return;
    }

    const isTap = Math.hypot(deltaX, deltaY) < 12;
    if (!isTap || touchGestureRef.current.size > 0) return;

    const now = Date.now();
    const tapDelta = now - lastTapTimestampRef.current;
    if (tapDelta > 0 && tapDelta < 300) {
      setZoomScale((value) => (value > 1 ? 1 : 2.2));
      if (lastTapPointRef.current) {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((lastTapPointRef.current.x - bounds.left) / bounds.width) * 100;
        const y = ((lastTapPointRef.current.y - bounds.top) / bounds.height) * 100;
        setZoomOrigin(`${x}% ${y}%`);
      }
      lastTapTimestampRef.current = 0;
      lastTapPointRef.current = null;
      return;
    }

    lastTapTimestampRef.current = now;
    lastTapPointRef.current = { x: event.clientX, y: event.clientY };
  }

  function handleImagePointerCancel() {
    touchGestureRef.current.clear();
    pinchStartRef.current = null;
  }

  function openMobileFullscreen() {
    setMobileFullscreenOpen(true);
  }

  function closeMobileFullscreen() {
    setMobileFullscreenOpen(false);
    setZoomScale(1);
    setZoomOrigin("50% 50%");
    pinchStartRef.current = null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#24170f] via-[#15100c] to-[#090706] text-white">
      <div className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Back Button */}
          <Link 
            href={backHref}
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
                  style={{ touchAction: "none", userSelect: "none" }}
                  onPointerMove={handleImagePointerMove}
                  onPointerDown={handleImagePointerDown}
                  onPointerUp={handleImagePointerUp}
                  onPointerCancel={handleImagePointerCancel}
                >
                  <Image
                    src={currentImage}
                    alt={producto.nombre}
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    quality={72}
                    priority
                    style={{
                      transformOrigin: zoomOrigin,
                      transform: `scale(${zoomScale})`,
                    }}
                    className="object-cover transition duration-200"
                  />
                  {!zoomActive && (
                    <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                      Hacé doble toque o abrí los dedos
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="border-t border-slate-700 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between gap-3 mb-3">
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

                    <button
                      type="button"
                      onClick={() => {
                        setZoomScale((value) => (value > 1 ? 1 : 2.2));
                        setZoomOrigin("50% 50%");
                      }}
                      className="mb-3 rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      {zoomActive ? "Desactivar zoom" : "Activar zoom"}
                    </button>

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

                <button
                  type="button"
                  onClick={openMobileFullscreen}
                  className="sm:hidden w-full border-t border-slate-700 bg-slate-950/95 px-4 py-3 text-sm font-semibold text-emerald-300"
                >
                  Abrir vista completa
                </button>
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

      {mobileFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-[#090706] text-white sm:hidden">
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090706]/95 px-4 py-3 backdrop-blur">
              <button
                type="button"
                onClick={closeMobileFullscreen}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white"
              >
                <span aria-hidden>←</span>
                Cerrar
              </button>
              <p className="ml-3 flex-1 truncate text-center text-sm font-medium text-slate-300">
                {producto.nombre}
              </p>
              <div className="w-[76px]" />
            </div>

            <div className="flex-1 px-4 pb-8 pt-4">
              <div className="mx-auto max-w-xl space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30">
                  <div
                    className="aspect-square relative overflow-hidden rounded-2xl"
                    style={{ touchAction: "none", userSelect: "none" }}
                    onPointerMove={handleImagePointerMove}
                    onPointerDown={handleImagePointerDown}
                    onPointerUp={handleImagePointerUp}
                    onPointerCancel={handleImagePointerCancel}
                  >
                    <Image
                      src={currentImage}
                      alt={producto.nombre}
                      fill
                      sizes="100vw"
                      quality={78}
                      priority
                      style={{
                        transformOrigin: zoomOrigin,
                        transform: `scale(${zoomScale})`,
                      }}
                      className="object-cover transition duration-200"
                    />
                    {!zoomActive && (
                      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                        Hacé doble toque o abrí los dedos
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => selectImage(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1)}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200"
                        >
                          ← Anterior
                        </button>
                        <p className="text-sm text-slate-400">
                          {activeImageIdx + 1} / {images.length}
                        </p>
                        <button
                          type="button"
                          onClick={() => selectImage(activeImageIdx === images.length - 1 ? 0 : activeImageIdx + 1)}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200"
                        >
                          Siguiente →
                        </button>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, idx) => (
                          <button
                            key={`${img}-${idx}`}
                            type="button"
                            onClick={() => selectImage(idx)}
                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                              activeImageIdx === idx ? "border-emerald-400" : "border-white/10"
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

                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <h1 className="text-2xl font-bold leading-tight">
                      {producto.nombre}
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                      <span className="font-semibold text-white">Color:</span> {producto.color}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">
                    {producto.descripcion}
                  </p>

                  {hasCuotas && selected ? (
                    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 overflow-hidden">
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white/5"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-400">PLAN SELECCIONADO</p>
                          <p className="mt-1 text-lg font-bold text-white">
                            {selected.dias} cuotas de {formatMoney(selected.diaria)}
                          </p>
                          <p className="text-sm font-semibold text-emerald-300">Precio por cuota</p>
                        </div>
                        <svg
                          className={`h-5 w-5 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>

                      {expanded && (
                        <div className="border-t border-slate-700/80">
                          {cuotas.map((c, idx) => (
                            <button
                              key={`${c.dias}-${c.diaria}`}
                              onClick={() => {
                                setSelectedIdx(idx);
                                setExpanded(false);
                              }}
                              className={`w-full border-t border-slate-800 px-4 py-3 text-left ${
                                selectedIdx === idx ? "bg-emerald-600/15" : "bg-transparent"
                              }`}
                            >
                              <p className="text-base font-semibold text-white">
                                {c.dias} cuotas de {formatMoney(c.diaria)}
                              </p>
                              <p className="text-sm text-slate-400">
                                Total: {formatMoney(c.diaria * c.dias)}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 text-sm text-slate-300">
                      Este producto no tiene planes de cuotas cargados todavia.
                    </div>
                  )}

                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-2xl bg-emerald-500 px-4 py-3 text-center font-bold text-white"
                  >
                    💬 Comprar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
