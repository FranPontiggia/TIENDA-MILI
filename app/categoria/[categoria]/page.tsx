import Link from "next/link";
import { subcategorias } from "@/data/categoria";

export default function CategoriaPage({ params }: { params: { categoria: string } }) {
  const filtradas = subcategorias.filter(
    (s) => s.categoria === params.categoria
  );

  return (
    <main style={{ padding: 40, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>{params.categoria}</h1>

      <div style={{ display: "grid", gap: 20, marginTop: 30 }}>
        {filtradas.map((s) => (
          <Link
            key={s.nombre}
            href={`/subcategoria/${s.nombre}`}
            style={{ padding: 20, background: "#1e293b", borderRadius: 10 }}
          >
            {s.nombre}
          </Link>
        ))}
      </div>
    </main>
  );
}