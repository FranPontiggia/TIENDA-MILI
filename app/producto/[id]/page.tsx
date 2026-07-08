import { getProductoById } from "@/data/productos";
import { notFound } from "next/navigation";
import ClientProductDetail from "./ClientProductDetail";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = Number(id);
  const producto = await getProductoById(parsedId);

  if (!producto) {
    notFound();
  }

  return <ClientProductDetail producto={producto} />;
}