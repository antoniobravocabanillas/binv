import Link from "next/link";
import { ArrowRight, Boxes, DraftingCompass, MapPinned, Radar, Ruler, ScanLine, Wrench, Zap } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TechnicalPageHero } from "@/components/technical-page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Servicios de topografia y soporte tecnico",
  description: "Servicios de levantamiento topografico, georreferenciacion, replanteo, control geometrico, alquiler, calibracion, capacitacion y soporte.",
  path: "/servicios"
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const serviceIcons = [MapPinned, Radar, DraftingCompass, Ruler, Boxes, Wrench, Zap, ScanLine];

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <>
      <TechnicalPageHero
        eyebrow="Servicios"
        title="Cobertura tecnica de campo, gabinete y soporte especializado"
        description="Servicios disenados para reducir riesgo operativo, mejorar trazabilidad y acelerar decisiones tecnicas con entregables claros."
        metrics={[
          { value: "Campo", label: "levantamiento, replanteo y control" },
          { value: "Gabinete", label: "procesamiento, CAD, GIS y modelos" },
          { value: "Soporte", label: "alquiler, calibracion y capacitacion" }
        ]}
        primaryCta={{ label: "Solicitar servicio", href: "/cotizacion" }}
        secondaryCta={{ label: "Hablar con asesor", href: "/contacto" }}
      />

      <section className="container py-20">
        <ScrollReveal>
          <Badge variant="outline">Servicios destacados</Badge>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold md:text-4xl">Soluciones estructuradas por problema, proceso y entregable</h2>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            Cada servicio conecta alcance tecnico, recursos de campo, control de calidad y seguimiento comercial.
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <ScrollReveal key={service.slug} delay={index * 55}>
                <Link href={`/servicios/${service.slug}`} className="block h-full">
                  <Card className="h-full transition duration-300 hover:-translate-y-1 hover:border-primary/60 motion-reduce:transform-none">
                    <CardHeader>
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.summary}</CardDescription>
                      <span className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">
                        Ver detalle <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-[#061827] py-16 text-white">
        <div className="container grid gap-5 md:grid-cols-3">
          {[
            ["Diagnostico", "levantamos alcance, restricciones, equipo requerido y entregables"],
            ["Ejecucion", "campo, gabinete, QA/QC y seguimiento operativo"],
            ["Cierre", "documentacion, recomendaciones y soporte posterior"]
          ].map(([title, text], index) => (
            <ScrollReveal key={title} delay={index * 80}>
              <div className="rounded-lg border border-white/14 bg-white/[0.06] p-6">
                <p className="font-display text-2xl font-bold text-[#24C8EE]">{title}</p>
                <p className="mt-3 text-sm leading-6 text-white/70">{text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
