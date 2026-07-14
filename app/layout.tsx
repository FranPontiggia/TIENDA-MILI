import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import HeaderProductSearch from "@/app/components/HeaderProductSearch";
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
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-white sm:text-xl">
              Cuota Market
            </Link>
            <HeaderProductSearch productos={searchProducts} />
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
