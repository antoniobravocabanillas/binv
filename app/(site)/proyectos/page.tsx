import Link from "next/link";
import { ArrowRight, BarChart3, Crosshair, FileCheck2, MapPinned } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TechnicalPageHero } from "@/components/technical-page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/content/site";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Proyectos y casos de exito",
  description: "Casos de exito en topografia, georreferenciacion y control geometrico.",
  path: "/proyectos"
});

const projectIcons = [MapPinned, Crosshair, BarChart3, FileCheck2];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const dbProjects = await prisma.project.findMany({
    where: { isPublic: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }]
  });
  const projectItems = dbProjects.length
    ? dbProjects.map((project) => ({
        title: project.title,
        summary: project.summary,
        sector: project.category || "Proyecto tecnico",
        metric: project.results || "Entregables auditables",
        slug: project.slug
      }))
    : projects.map((project) => ({ ...project, slug: "" }));

  return (
    <>
      <TechnicalPageHero
        eyebrow="Proyectos"
        title="Casos con evidencia tecnica, metricas y valor operativo"
        description="Trabajos donde la precision topografica ayuda a controlar avance, reducir retrabajo, documentar decisiones y sostener expedientes tecnicos."
        metrics={[
          { value: "42km", label: "control vial documentado" },
          { value: "128ha", label: "georreferenciacion catastral" },
          { value: "0.8mm", label: "control dimensional" }
        ]}
        primaryCta={{ label: "Cotizar proyecto", href: "/cotizacion" }}
        secondaryCta={{ label: "Ver servicios", href: "/servicios" }}
      />

      <section className="container py-20">
        <ScrollReveal>
          <Badge variant="outline">Casos destacados</Badge>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold md:text-4xl">Cada caso se comunica por alcance, resultado y evidencia entregable</h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projectItems.map((project, index) => {
            const Icon = projectIcons[index % projectIcons.length];
            return (
              <ScrollReveal key={project.title} delay={index * 70}>
                <Link href={project.slug ? `/proyectos/${project.slug}` : "/contacto"} className="block h-full">
                <Card className="h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-primary/60 motion-reduce:transform-none">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="outline">{project.sector}</Badge>
                        <CardTitle className="mt-4">{project.title}</CardTitle>
                      </div>
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardDescription>{project.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="border-t bg-muted/35 p-5">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Resultado operativo</p>
                    <p className="mt-1 font-display text-3xl font-bold text-primary">{project.metric}</p>
                  </CardContent>
                </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-[#061827] py-16 text-white">
        <div className="container flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#7DE4FF]">Propuesta consultiva</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold">Convirtamos tu alcance en un plan de medicion, entregables y soporte</h2>
          </div>
          <Link href="/contacto" className="inline-flex items-center gap-2 font-semibold text-[#7DE4FF]">
            Conversar con ICC <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
