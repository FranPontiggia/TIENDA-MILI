"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Producto } from "@/data/productos";

const formatMoney = (v: number) => `$${v.toLocaleString("es-AR")}`;

export default function ClientProductDetail({ producto }: { producto: Producto }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const cuotas = producto.cuotas || [];
  if (cuotas.length === 0) return null;

  const selected = cuotas[selectedIdx];
  const whatsapp = `https://wa.me/5492983541686?text=${encodeURIComponent(
    `Hola, quiero comprar ${producto.nombre} - Plan: ${selected.dias} cuotas a $${selected.diaria} por día`
  )}`;

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
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                <div className="aspect-square relative">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
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
              <h2 className="text-xl font-bold mb-4">Elegí tu plan de pago</h2>

              <div className="rounded-lg border border-slate-700 overflow-hidden mb-8">
                {/* Header del acordeón */}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800 transition border-b border-slate-700"
                >
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-semibold">PLAN SELECCIONADO</p>
                    <p className="font-bold text-lg mt-1">
                      {selected.dias} cuotas
                    </p>
                    <p className="text-emerald-400 font-semibold">
                      {formatMoney(selected.diaria)}/día
                    </p>
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

                {/* Planes expandidos */}
                {expanded && (
                  <div className="bg-slate-950">
                    {cuotas.map((c, idx) => (
                      <button
                        key={c.dias}
                        onClick={() => {
                          setSelectedIdx(idx);
                          setExpanded(false);
                        }}
                        className={`w-full flex items-center justify-between p-4 border-t border-slate-700 hover:bg-slate-900 transition text-left ${
                          selectedIdx === idx ? "bg-emerald-600/20" : ""
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{c.dias} cuotas</p>
                          <p className="text-sm text-slate-400 mt-1">
                            {formatMoney(c.diaria)}/día • Total: {formatMoney(c.diaria * c.dias)}
                          </p>
                        </div>
                        {selectedIdx === idx && (
                          <div className="text-emerald-400 ml-4 flex-shrink-0">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
