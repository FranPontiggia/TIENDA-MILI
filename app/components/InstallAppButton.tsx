"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type InstallAppButtonProps = {
  className?: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallAppButton({ className }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const pathname = usePathname();

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) {
      setIsInstalled(true);
    }

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    const installFromHomeHint =
      pathname !== "/" ? "\n\nTip: para que abra en Inicio, instalala estando en la pantalla de Inicio." : "";

    if (isIos) {
      window.alert(`En iPhone: toca Compartir y luego 'Agregar a inicio'.${installFromHomeHint}`);
      return;
    }

    if (!deferredPrompt) {
      window.alert(
        `Si no aparece instalacion directa: abre el menu del navegador y elegi 'Instalar aplicacion' o 'Agregar a pantalla de inicio'.${installFromHomeHint}`
      );
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <button type="button" onClick={handleInstall} className={className} aria-label="Instalar app">
      Instalar app
    </button>
  );
}
