import { products } from "@/lib/content/products";

export default function AdminProductsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Productos</h1>
      <div className="mt-6 overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Producto</th><th>Marca</th><th>Categoria</th><th>Estado</th></tr></thead>
          <tbody>{products.map((product) => <tr key={product.slug} className="border-t"><td className="p-3 font-medium">{product.name}</td><td>{product.brand}</td><td>{product.category}</td><td>{product.badge}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
