import { notFound } from "next/navigation";
import { Download, MessageCircle, ShoppingCart } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/lib/content/products";
import { createMetadata } from "@/lib/seo";
import { absoluteUrl, formatCurrency } from "@/lib/utils";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  return createMetadata({ title: product.name, description: product.summary, path: `/tienda/${product.slug}` });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => product.related.includes(item.slug));
  const quoteSubject = `${product.name} | ${product.brand} ${product.model} | Categoria: ${product.category}`;
  const quoteContext = `Producto: ${product.name} | Marca: ${product.brand} | Modelo: ${product.model} | Categoria: ${product.category} | URL: ${absoluteUrl(`/tienda/${product.slug}`)}`;

  return (
    <section className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="technical-grid aspect-[16/10] rounded-lg border bg-muted p-6">
            <div className="flex h-full items-end rounded-md bg-white/86 p-6">
              <div>
                <Badge>{product.badge}</Badge>
                <h1 className="mt-4 text-4xl font-bold">{product.name}</h1>
                <p className="mt-2 text-muted-foreground">{product.brand} · {product.model}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Descripcion comercial</CardTitle></CardHeader>
              <CardContent className="leading-7 text-muted-foreground">{product.description}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Especificaciones tecnicas</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 border-b pb-2">
                      <dt className="font-medium">{key}</dt>
                      <dd className="text-right text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{product.price ? formatCurrency(product.price) : "Precio bajo cotizacion"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Disponibilidad: <strong className="text-foreground">{product.availability}</strong></p>
              <Button className="w-full" disabled={!product.price}>
                <ShoppingCart className="h-4 w-4" />
                {product.price ? "Agregar al carrito" : "Compra consultiva"}
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <a href="#cotizar-producto">Solicitar cotizacion</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51999999999"}`}>
                  <MessageCircle className="h-4 w-4" />
                  Asesor tecnico
                </a>
              </Button>
              <Button variant="ghost" className="w-full">
                <Download className="h-4 w-4" />
                Descargar ficha tecnica
              </Button>
            </CardContent>
          </Card>
          <div id="cotizar-producto" className="scroll-mt-24">
            <ContactForm intent="product" context={quoteContext} subject={quoteSubject} />
          </div>
        </aside>
      </div>
      {related.length ? (
        <div className="mt-14">
          <h2 className="text-2xl font-bold">Productos relacionados</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </div>
      ) : null}
    </section>
  );
}
