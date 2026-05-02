import { ClipboardCheck, FileText, Settings2 } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TechnicalPageHero } from "@/components/technical-page-hero";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Solicitar cotizacion",
  description: "Solicita cotizacion para servicios topograficos, equipos, alquiler, calibracion o soporte tecnico.",
  path: "/cotizacion"
});

const quoteSteps = [
  { icon: ClipboardCheck, title: "Alcance", text: "Revisamos servicio, equipo, soporte requerido, ciudad, plazos y condiciones operativas." },
  { icon: Settings2, title: "Configuracion", text: "Definimos instrumentacion, accesorios, cuadrilla, entregables o paquete comercial." },
  { icon: FileText, title: "Propuesta", text: "Entregamos cotizacion clara con condiciones, siguientes pasos y soporte disponible." }
];

export default function QuotePage() {
  return (
    <>
      <TechnicalPageHero
        eyebrow="Cotizacion"
        title="Recibe una propuesta tecnica y comercial clara"
        description="Cuéntanos el alcance y preparamos una respuesta ordenada para servicios topograficos, compra de equipos, alquiler, calibracion o soporte especializado."
        metrics={[
          { value: "Alcance", label: "contexto tecnico y operativo" },
          { value: "Equipo", label: "configuracion recomendada" },
          { value: "Oferta", label: "condiciones comerciales claras" }
        ]}
        primaryCta={{ label: "Completar solicitud", href: "#formulario" }}
        secondaryCta={{ label: "Ver tienda", href: "/tienda" }}
      />

      <section id="formulario" className="container grid gap-10 py-20 lg:grid-cols-[1fr_480px]">
        <div className="space-y-4">
          {quoteSteps.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={index * 70}>
              <Card className="transition duration-300 hover:-translate-y-1 hover:border-primary/60 motion-reduce:transform-none">
                <CardHeader className="grid gap-4 md:grid-cols-[38px_1fr]">
                  <Icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{text}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={120}>
          <ContactForm intent="quote" context="Cotizacion general" />
        </ScrollReveal>
      </section>
    </>
  );
}
