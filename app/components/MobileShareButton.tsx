"use client";

import { useState } from "react";

export default function MobileShareButton() {
  const [feedback, setFeedback] = useState<"idle" | "ok" | "error">("idle");

  async function handleShare() {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = "Cuota Market";
    const text = "Mira esta tienda";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setFeedback("ok");
        setTimeout(() => setFeedback("idle"), 1600);
        return;
      }

      await navigator.clipboard.writeText(url);
      setFeedback("ok");
      setTimeout(() => setFeedback("idle"), 1600);
    } catch {
      setFeedback("error");
      setTimeout(() => setFeedback("idle"), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-slate-300/40 bg-slate-900/90 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition hover:bg-slate-800 md:hidden"
      aria-label="Compartir tienda"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342a3 3 0 1 0 0-2.684m6.632 4.026a3 3 0 1 0 0-5.368m-6.632 2.684h6.632" />
      </svg>
      {feedback === "idle" && <span>Compartir</span>}
      {feedback === "ok" && <span>Listo</span>}
      {feedback === "error" && <span>No se pudo</span>}
    </button>
  );
}
