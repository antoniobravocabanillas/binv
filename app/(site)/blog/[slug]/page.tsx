import { notFound } from "next/navigation";
import { ConversionBand } from "@/components/conversion-band";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

type BlogPostProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return createMetadata({ title: post.metaTitle || post.title, description: post.metaDesc || post.excerpt, path: `/blog/${post.slug}` });
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.publishedAt) notFound();
  const content = post.content as { body?: string; blocks?: { text?: string }[] };

  return (
    <>
      <article className="container max-w-3xl py-16">
        <Badge variant="outline">{post.category || "Recurso tecnico"}</Badge>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
        <div className="prose prose-slate mt-10 max-w-none">
          {content.body ? (
            content.body.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            content.blocks?.map((block, index) => <p key={index}>{block.text}</p>)
          )}
        </div>
      </article>
      <ConversionBand />
    </>
  );
}
