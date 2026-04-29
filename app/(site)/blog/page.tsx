import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { posts } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Blog y recursos", description: "Guias de compra, mantenimiento y operacion para topografia e instrumentacion.", path: "/blog" });

export default function BlogPage() {
  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Recursos" title="Contenido tecnico para decidir mejor" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:border-primary">
              <CardHeader>
                <Badge variant="outline">{post.category}</Badge>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
