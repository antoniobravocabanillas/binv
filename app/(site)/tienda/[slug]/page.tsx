import { notFound } from "next/navigation";
import Image from "next/image";
import { Download, MessageCircle, ShoppingCart } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/server/serializers";
import { createMetadata } from "@/lib/seo";
import { absoluteUrl, formatCurrency } from "@/lib/utils";

type ProductPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return createMetadata({ title: product.name, description: product.summary, path: `/tienda/${product.slug}` });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, variants: true }
  });
  if (!dbProduct) notFound();

  const product = serializeProduct(dbProduct);
  const related = (await prisma.product.findMany({
    where: { categoryId: dbProduct.categoryId, id: { not: dbProduct.id } },
    include: { category: true, variants: true },
    take: 3
  })).map(serializeProduct);
  const specs = product.specifications as Record<string, string>;
  const coverImage = product.images[0];
  const quoteSubject = `${product.name} | ${product.brand} ${product.model || ""} | Categoria: ${product.category.name}`;
  const quoteContext = `Producto: ${product.name} | SKU: ${product.sku} | Marca: ${product.brand} | Modelo: ${product.model || "-"} | Categoria: ${product.category.name} | URL: ${absoluteUrl(`/tienda/${product.slug}`)}`;

  return (
    <section className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="technical-grid aspect-[16/10] rounded-lg border bg-muted p-6">
            <div className="relative flex h-full items-end overflow-hidden rounded-md bg-white/86 p-6">
              {coverImage ? (
                <>
                  <Image src={coverImage} alt={product.name} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/16 to-transparent" />
                </>
              ) : null}
              <div className="relative z-10">
                <Badge>{product.badge || (product.requiresQuote ? "Cotizar" : "Disponible")}</Badge>
                <h1 className={coverImage ? "mt-4 text-4xl font-bold text-white" : "mt-4 text-4xl font-bold"}>{product.name}</h1>
                <p className={coverImage ? "mt-2 text-white/82" : "mt-2 text-muted-foreground"}>{product.brand} - {product.model}</p>
              </div>
            </div>
          </div>
          {product.images.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-5">
              {product.images.slice(1, 6).map((image, index) => (
                <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
                  <Image src={image} alt={`${product.name} imagen ${index + 2}`} fill sizes="160px" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Descripcion comercial</CardTitle></CardHeader>
              <CardContent className="leading-7 text-muted-foreground">{product.description}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Especificaciones tecnicas</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  {Object.entries(specs).map(([key, value]) => (
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
              <p className="text-sm text-muted-foreground">
                Disponibilidad: <strong className="text-foreground">{product.stock > 0 ? `${product.stock} disponible(s)` : product.availability}</strong>
              </p>
              <Button className="w-full" disabled={!product.price || product.stock <= 0}>
                <ShoppingCart className="h-4 w-4" />
                {product.price && product.stock > 0 ? "Agregar al carrito" : "Compra consultiva"}
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
              <Button asChild={Boolean(product.technicalSheet)} variant="ghost" className="w-full" disabled={!product.technicalSheet}>
                {product.technicalSheet ? (
                  <a href={product.technicalSheet} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    Descargar ficha tecnica
                  </a>
                ) : (
                  <span>
                    <Download className="h-4 w-4" />
                    Ficha tecnica pendiente
                  </span>
                )}
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
