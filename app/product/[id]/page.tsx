import { productos } from '../../../data/productos';
import ClientProductDetail from './ClientProductDetail';

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) return <div className="p-8">Producto no encontrado</div>;

  return <ClientProductDetail producto={producto} />;
}
