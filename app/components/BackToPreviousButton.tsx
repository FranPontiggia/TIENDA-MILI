"use client";

import { useRouter } from "next/navigation";

type BackToPreviousButtonProps = {
  className?: string;
};

export default function BackToPreviousButton({ className }: BackToPreviousButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Volver
    </button>
  );
}
