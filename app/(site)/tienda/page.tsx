import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, products } from "@/lib/content/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tienda tecnica de equipos topograficos",
  description: "Catalogo profesional de estaciones totales, GNSS, niveles, drones, escaneres, accesorios, alquiler y soporte tecnico.",
  path: "/tienda"
});

export default function StorePage() {
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
              <button key={category} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">{category}</button>
            ))}
          </div>
        </aside>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </div>
    </section>
  );
}
