import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import HeaderProductSearch from "@/app/components/HeaderProductSearch";
import MobileShareButton from "@/app/components/MobileShareButton";
import { getProductos } from "@/data/productos";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cuota Market",
  description: "Electrodomésticos confiables para tu hogar. Pedidos y consultas por WhatsApp.",
  manifest: "/manifest.webmanifest",
  themeColor: "#120d09",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cuota Market",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const productos = await getProductos();
  const searchProducts = productos.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    subcategoria: producto.subcategoria,
    color: producto.color,
    imagen: producto.imagen,
  }));

  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#120d09]/85 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
            <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-white sm:text-xl">
              Cuota Market
            </Link>
            <Link
              href="/solicitar-efectivo"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-emerald-400/45 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-300/70 hover:bg-emerald-500/25 lg:inline-flex"
            >
              Solicitar efectivo
              <span aria-hidden>↗</span>
            </Link>
            <HeaderProductSearch productos={searchProducts} />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <Link
          href="/solicitar-efectivo"
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition hover:bg-emerald-400 md:hidden"
        >
          Efectivo
          <span aria-hidden>↗</span>
        </Link>

        <MobileShareButton />
      </body>
    </html>
  );
}
