import { productos } from "../../../data/productos";;
import Image from "next/image";

export default function ProductoPage({ params }: any) {
  const producto = productos.find((p) => p.id == params.id);

  if (!producto) {
    return (
      <div className="p-10 text-white bg-slate-950 min-h-screen">
        Producto no encontrado
      </div>
    );
  }

  const whatsapp = `https://wa.me/5492983541686?text=Hola, quiero comprar ${producto.nombre}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Imagen */}
        <div className="rounded-2xl overflow-hidden mb-6">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={800}
            height={500}
            className="w-full object-cover"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold">{producto.nombre}</h1>

        {/* Descripción */}
        <p className="text-slate-300 mt-3">{producto.descripcion}</p>

        {/* Color */}
        <p className="mt-2 text-sm text-slate-400">
          Color: {producto.color}
        </p>

        {/* Cuotas */}
        <h2 className="mt-8 text-xl font-bold">
          Elegí tu plan de pago
        </h2>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {producto.cuotas?.map((c) => (
            <div
              key={c.dias}
              className="p-4 rounded-xl border border-white/10 bg-white/5"
            >
              <p className="text-sm">{c.dias} cuotas</p>
              <p className="font-bold text-emerald-400">
                ${c.diaria} por día
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp */}
        <a
          href={whatsapp}
          target="_blank"
          className="mt-8 inline-block bg-emerald-500 text-black px-6 py-3 rounded-full font-bold"
        >
          Comprar por WhatsApp
        </a>

      </div>
    </main>
  );
}