import { redirect } from "next/navigation";

export default async function CategoriasRedirectPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const normalizedCategoria = decodeURIComponent(categoria);

  redirect(`/categoria/${encodeURIComponent(normalizedCategoria)}`);
}