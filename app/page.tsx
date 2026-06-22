import Image from "next/image";
import { productos, type Producto } from "../data/productos";

function ProductCard({ producto }: { producto: Producto }) {
  const whatsappUrl = `https://wa.me/5492983541686?text=${encodeURIComponent(
    `Hola, quiero comprar ${producto.nombre}`
  )}`;

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{producto.nombre}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{producto.descripcion}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold text-emerald-600">
            ${producto.precio.toLocaleString("es-AR")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-slate-50 to-slate-50 text-center py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full bg-emerald-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
            Tienda de electrodomésticos
          </span>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            MILI STORE
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">
            Electrodomésticos confiables para tu hogar, con envío y pedidos rápidos por WhatsApp.
          </p>

          <a
            href="#productos"
            className="mt-10 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ver productos
          </a>
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-6 pb-16 pt-12">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Electrodomésticos</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Destacados para el hogar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Encuentra equipos prácticos y duraderos. Consulta stock y realiza tu pedido por WhatsApp.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </main>
  );
}
