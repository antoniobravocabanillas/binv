import Link from "next/link";
import { ArrowRight, CheckCircle2, Factory, MapPinned, Ruler, ShieldCheck } from "lucide-react";
import { ConversionBand } from "@/components/conversion-band";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TechnicalPageHero } from "@/components/technical-page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { operatingStandard } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Nosotros",
  description: "Empresa especializada en topografia, geodesia, instrumentacion, venta tecnica y soporte para proyectos de ingenieria.",
  path: "/nosotros"
});

const principles = [
  {
    icon: Ruler,
    title: "Precision operativa",
    text: "Medicion, replanteo y control con procedimientos trazables para campo y gabinete."
  },
  {
    icon: ShieldCheck,
    title: "Seguridad y QA/QC",
    text: "Control de calidad, criterios de seguridad y entregables listos para auditoria tecnica."
  },
  {
    icon: Factory,
    title: "Vision comercial B2B",
    text: "Venta tecnica, alquiler, capacitacion y soporte alineados al uso real de cada proyecto."
  }
];

export default function AboutPage() {
  return (
    <>
      <TechnicalPageHero
        eyebrow="Nosotros"
        title="Ingenieria, construccion y consultoria con respaldo topografico"
        description={`${brand.name} consolida la experiencia de A&B Topografia Peru en una operacion corporativa para proyectos que requieren precision, trazabilidad, equipos correctos y soporte tecnico real.`}
        metrics={[
          { value: "12+", label: "anos de experiencia acumulada" },
          { value: "QA/QC", label: "control de entregables" },
          { value: "B2B", label: "servicios, equipos y soporte" }
        ]}
        primaryCta={{ label: "Solicitar cotizacion", href: "/cotizacion" }}
        secondaryCta={{ label: "Ver servicios", href: "/servicios" }}
      />

      <section className="border-y bg-white/75 py-18">
        <div className="container grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={index * 70}>
              <Card className="h-full transition duration-300 hover:-translate-y-1 hover:border-primary/60 motion-reduce:transform-none">
                <CardHeader>
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="container grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <ScrollReveal>
          <Badge variant="outline">{operatingStandard.kicker}</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{operatingStandard.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">{operatingStandard.description}</p>
          <Button asChild className="mt-7">
            <a href={brand.legacyBrochure}>Ver brochure historico A&amp;B <ArrowRight className="h-4 w-4" /></a>
          </Button>
        </ScrollReveal>
        <div className="grid gap-4">
          {operatingStandard.credentials.map((item, index) => (
            <ScrollReveal key={item} delay={index * 70}>
              <div className="grid gap-4 rounded-lg border bg-card p-5 shadow-technical md:grid-cols-[36px_1fr]">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="border-y bg-[#061827] py-20 text-white">
        <div className="container grid gap-8 lg:grid-cols-[1fr_420px]">
          <ScrollReveal>
            <Badge className="bg-[#12B5DC] text-white">Cobertura y responsabilidad</Badge>
            <h2 className="mt-5 font-display text-3xl font-bold md:text-4xl">Una marca preparada para obra, expediente y compra tecnica</h2>
            <p className="mt-5 max-w-3xl leading-8 text-white/70">
              ICC integra personal tecnico, metodologia de campo, soporte comercial y seleccion de instrumentacion para reducir riesgo operativo y acelerar decisiones.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="rounded-lg border border-white/14 bg-white/[0.06] p-6">
              <MapPinned className="h-7 w-7 text-[#24C8EE]" />
              <p className="mt-5 text-2xl font-bold">Operacion nacional coordinada desde un flujo consultivo</p>
              <Link href="/contacto" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#7DE4FF]">
                Hablar con un asesor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ConversionBand />
    </>
  );
}
