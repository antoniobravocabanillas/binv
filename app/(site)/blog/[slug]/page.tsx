import { notFound } from "next/navigation";
import { ConversionBand } from "@/components/conversion-band";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

type BlogPostProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  return createMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  return (
    <>
      <article className="container max-w-3xl py-16">
        <Badge variant="outline">{post.category}</Badge>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
        <div className="prose prose-slate mt-10 max-w-none">
          <p>Este recurso esta preparado como pieza SEO inicial. En produccion, el panel CMS permite editar cuerpo, metadatos, autor, imagen destacada, schema y enlaces internos.</p>
          <h2>Criterios tecnicos</h2>
          <p>La decision debe partir del tipo de proyecto, tolerancias, entorno, compatibilidad de datos y capacidad de soporte posterior.</p>
          <h2>Recomendacion comercial</h2>
          <p>Para compras de alto ticket conviene validar configuracion, garantia, accesorios y capacitacion antes de emitir orden de compra.</p>
        </div>
      </article>
      <ConversionBand />
    </>
  );
}
