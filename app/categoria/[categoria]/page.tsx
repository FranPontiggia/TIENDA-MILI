import Link from "next/link";
import { subcategorias } from "@/data/categoria";

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const filtradas = subcategorias.filter(
    (s) => s.categoria === categoria
  );

  return (
    <main style={{ padding: 40, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>{categoria}</h1>

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