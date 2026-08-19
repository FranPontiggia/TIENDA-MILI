"use client";

import { useState } from "react";

type ProductShareButtonProps = {
  productName: string;
  className?: string;
  variant?: "default" | "overlay";
};

export default function ProductShareButton({
  productName,
  className,
  variant = "default",
}: ProductShareButtonProps) {
  const [feedback, setFeedback] = useState<"idle" | "ok" | "error">("idle");

  async function handleShare() {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = productName;
    const text = `Mira este producto en Cuota Market: ${productName}`;

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

  if (variant === "overlay") {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={
          className ??
          "absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition hover:scale-105 hover:text-emerald-600"
        }
        aria-label="Compartir producto"
      >
        {feedback === "ok" ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12L16 7M8 12L16 17"
            />
            <circle cx="6" cy="12" r="2" />
            <circle cx="18" cy="7" r="2" />
            <circle cx="18" cy="17" r="2" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-3 font-semibold text-slate-100 transition hover:border-emerald-400/60 hover:text-emerald-200"
      }
      aria-label="Compartir producto"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12L16 7M8 12L16 17"
        />
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="18" cy="17" r="2" />
      </svg>
      {feedback === "idle" && <span>Compartir producto</span>}
      {feedback === "ok" && <span>Link copiado</span>}
      {feedback === "error" && <span>No se pudo</span>}
    </button>
  );
}
