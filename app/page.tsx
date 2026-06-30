import Link from "next/link";
import { categorias } from "../data/categoria";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Tienda Cuotas
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Los mejores electrodomésticos y productos para tu hogar y negocio en planes de cuotas sin interés
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {categorias.map((cat, idx) => (
              <Link
                key={cat.nombre}
                href={`/categoria/${cat.nombre}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 group-hover:from-emerald-600/40 group-hover:to-blue-600/40 transition-all duration-300" />
                <div className="absolute inset-0 border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all rounded-2xl" />
                
                <div className="relative p-8 sm:p-10 backdrop-blur-sm">
                  <div className="mb-4">
                    {idx === 0 ? (
                      <div className="text-5xl mb-4">🏡</div>
                    ) : (
                      <div className="text-5xl mb-4">🏪</div>
                    )}
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2 group-hover:text-emerald-300 transition">
                    {cat.nombre}
                  </h2>
                  <p className="text-slate-300 text-sm mb-4">
                    {idx === 0
                      ? "Electrohogar, TV, bazar, cuidado personal y más"
                      : "Heladeras, balanzas, freezer, panadería y más"}
                  </p>
                  
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    Ver subcategorías
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-slate-800">
        <div className="mx-auto max-w-6xl grid grid-cols-3 gap-4 sm:gap-8">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">+150</p>
            <p className="text-xs sm:text-sm text-slate-400">Clientes satisfechos</p>
          </div>
          <div className="text-center border-l border-r border-slate-800">
            <p className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">24h</p>
            <p className="text-xs sm:text-sm text-slate-400">Atención WhatsApp</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">+50</p>
            <p className="text-xs sm:text-sm text-slate-400">Productos</p>
          </div>
        </div>
      </section>
    </main>
  );
}