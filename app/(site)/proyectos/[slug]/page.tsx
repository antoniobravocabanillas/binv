import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { ConversionBand } from "@/components/conversion-band";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || !project.isPublic) return {};
  return createMetadata({
    title: project.title,
    description: project.summary,
    path: `/proyectos/${project.slug}`
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      members: { include: { staffProfile: true } }
    }
  });
  if (!project || !project.isPublic) notFound();

  return (
    <>
      <article className="bg-[#03111D] text-white">
        <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_420px]">
          <div>
            <Badge className="bg-white text-[#063D63] hover:bg-white">{project.category || "Proyecto tecnico"}</Badge>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl">{project.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{project.summary}</p>
            {project.location ? (
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7DE4FF]">
                <MapPin className="h-4 w-4" /> {project.location}
              </p>
            ) : null}
          </div>
          <Card className="border-white/14 bg-white/[0.055] text-white backdrop-blur">
            <CardHeader>
              <CardTitle>Entregables y resultado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-white/72">
              <p>{project.results || "Documentacion tecnica, evidencia de campo y entregables auditables para toma de decisiones."}</p>
              <Button asChild>
                <Link href={`/cotizacion?context=proyecto:${project.slug}`}>
                  Cotizar proyecto similar <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </article>

      <section className="container grid gap-8 py-16 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {project.images.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {project.images.map((image) => (
                <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                  <Image src={image.url} alt={image.alt || project.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/40 p-10 text-muted-foreground">Galeria pendiente de carga desde admin.</div>
          )}

          <Section title="Descripcion" body={project.description} />
          <Section title="Reto del proyecto" body={project.challenge} />
          <Section title="Solucion aplicada" body={project.solution} />
        </div>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Servicios aplicados</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(project.servicesApplied.length ? project.servicesApplied : ["Topografia", "Control tecnico"]).map((service) => (
                <Badge key={service} variant="outline">{service}</Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Equipo asignado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="rounded-md border p-3">
                  <p className="font-semibold">{member.staffProfile.displayName}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              ))}
              {!project.members.length ? <p className="text-sm text-muted-foreground">Equipo interno no publicado.</p> : null}
            </CardContent>
          </Card>
        </aside>
      </section>
      <ConversionBand />
    </>
  );
}

function Section({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <section>
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      <p className="mt-4 leading-8 text-muted-foreground">{body}</p>
    </section>
  );
}
