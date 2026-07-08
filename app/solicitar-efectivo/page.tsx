import Link from "next/link";

const WHATSAPP_PHONE = "5492983541686";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero solicitar efectivo. Mis datos: Nombre y apellido:, Ciudad:, Monto aproximado:, Horario para contactarme:"
);

export default function SolicitarEfectivoPage() {
  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 transition hover:text-emerald-400"
        >
          <span aria-hidden>←</span>
          Volver al inicio
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700/80 bg-slate-900/85 p-8 shadow-xl shadow-black/20 sm:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Servicio</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Solicitar efectivo</h1>
          <p className="mt-5 max-w-2xl text-slate-300">
            Te asesoramos por WhatsApp para iniciar tu solicitud. No hace falta completar formulario por ahora.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">Atencion personalizada</div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">Respuesta por WhatsApp</div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">Sin formulario obligatorio</div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">Coordinacion de requisitos</div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Solicitar efectivo por WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}
