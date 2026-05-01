import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/server/serializers";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tienda tecnica de equipos topograficos",
  description: "Catalogo profesional de estaciones totales, GNSS, niveles, drones, escaneres, accesorios, alquiler y soporte tecnico.",
  path: "/tienda"
});

export default async function StorePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ include: { category: true, variants: true }, orderBy: { updatedAt: "desc" } })
  ]);
  const storeProducts = products.map(serializeProduct);

  return (
    <section className="container py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Badge variant="accent">E-commerce B2B</Badge>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Tienda tecnica para topografia e instrumentacion</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">Compra productos con precio publicado o solicita una cotizacion consultiva para soluciones de alto ticket.</p>
        </div>
        <Button>Comparar equipos</Button>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border bg-card p-5">
          <Input placeholder="Buscar equipo o modelo" />
          <div className="mt-5 space-y-2">
            {categories.map((category) => (
              <button key={category.id} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">
                {category.name} <span className="text-xs text-muted-foreground">({category._count.products})</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {storeProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </div>
    </section>
  );
}
