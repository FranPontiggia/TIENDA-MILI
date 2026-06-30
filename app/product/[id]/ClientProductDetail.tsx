"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Producto } from "../../../data/productos";

const formatMoney = (v: number) => `$${v.toLocaleString("es-AR")}`;

export default function ClientProductDetail({ producto }: { producto: Producto }) {
  const planNums = [250, 200, 150, 100];
  const initialPlans = planNums.map((n) => ({ n, price: Math.round(producto.precio / n) }));

  const [plans, setPlans] = useState(initialPlans);
  const [selected, setSelected] = useState(0);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [caracteristicas, setCaracteristicas] = useState("");
  const [especificaciones, setEspecificaciones] = useState("");

  const updatePrice = (idx: number, value: number) => {
    const copy = plans.slice();
    copy[idx] = { ...copy[idx], price: value };
    setPlans(copy);
  };

  const plan = plans[selected];

  const whatsappText = encodeURIComponent(
    `Hola, quiero información sobre ${producto.nombre} - Plan: ${plan.n} cuotas - Precio por cuota: ${formatMoney(
      plan.price
    )}`
  );

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex gap-6">
          <div className="w-1/3">
            <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden">
              {producto.imagen ? (
                <Image src={producto.imagen} alt={producto.nombre} fill className="object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">Sin imagen</div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{producto.nombre}</h1>
            <p className="mt-2 text-slate-600">{producto.descripcion}</p>
            <p className="mt-3 text-lg font-semibold">Precio total: {formatMoney(producto.precio)}</p>

            <section className="mt-6 rounded-lg border p-4">
              <h2 className="font-semibold">Planes de pago</h2>
              <p className="text-sm text-slate-600 mb-3">Edita el precio por cuota y selecciona el plan que prefieras.</p>

              <div className="space-y-3">
                {plans.map((pl, idx) => {
                  if (!showAllPlans && idx !== 0) return null;
                  return (
                    <label key={pl.n} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selected === idx}
                        onChange={() => setSelected(idx)}
                      />
                      <span className="w-28">{pl.n} cuotas</span>
                      <input
                        className="w-36 rounded-md border px-2 py-1"
                        type="number"
                        value={pl.price}
                        onChange={(e) => updatePrice(idx, Number(e.target.value || 0))}
                      />
                      <span className="text-sm text-slate-600">Precio total: {formatMoney(pl.price * pl.n)}</span>
                    </label>
                  );
                })}

                {plans.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowAllPlans((s) => !s)}
                    className="mt-2 text-sm text-emerald-600 hover:underline"
                  >
                    {showAllPlans ? "Ocultar planes" : `Ver ${plans.length - 1} planes más`}
                  </button>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={`https://wa.me/5492983541686?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white"
                >
                  Consultar por WhatsApp
                </a>
                <Link href="/" className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm">Volver</Link>
              </div>
            </section>

            <section className="mt-6">
              <h3 className="font-semibold">Características generales</h3>
              <textarea
                placeholder="Completa las características generales aquí"
                value={caracteristicas}
                onChange={(e) => setCaracteristicas(e.target.value)}
                className="mt-2 w-full rounded-md border p-3 min-h-[80px]"
              />
            </section>

            <section className="mt-6">
              <h3 className="font-semibold">Especificaciones técnicas</h3>
              <textarea
                placeholder="Completa las especificaciones técnicas aquí"
                value={especificaciones}
                onChange={(e) => setEspecificaciones(e.target.value)}
                className="mt-2 w-full rounded-md border p-3 min-h-[120px]"
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
