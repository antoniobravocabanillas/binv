import { Clock3, MessageCircle, Route, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TechnicalPageHero } from "@/components/technical-page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contacto",
  description: "Contacta a un asesor tecnico para servicios, equipos, soporte o proyectos topograficos.",
  path: "/contacto"
});

const contactRoutes = [
  { icon: Route, title: "Servicios de campo", text: "Levantamientos, replanteos, georreferenciacion, fotocontrol y control geometrico." },
  { icon: ShieldCheck, title: "Soporte tecnico", text: "Mantenimiento, calibracion, garantia, diagnostico y configuracion de instrumentos." },
  { icon: MessageCircle, title: "Compra consultiva", text: "Equipos, accesorios, alquiler, capacitacion y propuestas B2B de alto ticket." }
];

export default function ContactPage() {
  return (
    <>
      <TechnicalPageHero
        eyebrow="Contacto"
        title="Un canal directo para campo, gabinete y compra tecnica"
        description="Cuéntanos que necesitas y encaminamos tu solicitud al flujo correcto: servicio, producto, soporte, mantenimiento, alquiler o capacitacion."
        metrics={[
          { value: "<24h", label: "revision comercial inicial" },
          { value: "360", label: "servicio, equipo y soporte" },
          { value: "B2B", label: "cotizacion tecnica ordenada" }
        ]}
        primaryCta={{ label: "Solicitar cotizacion", href: "/cotizacion" }}
        secondaryCta={{ label: "Ver tienda tecnica", href: "/tienda" }}
      />

      <section className="container grid gap-10 py-20 lg:grid-cols-[1fr_460px]">
        <div className="space-y-8">
          <ScrollReveal>
            <Badge variant="outline">Flujo de atencion</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">La solicitud entra con contexto, no como mensaje suelto</h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
              El equipo comercial identifica si necesitas una propuesta de servicio, una compra tecnica, alquiler, soporte o una visita especializada.
            </p>
          </ScrollReveal>
          <div className="grid gap-4">
            {contactRoutes.map(({ icon: Icon, title, text }, index) => (
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
          <ScrollReveal>
            <div className="rounded-lg border bg-[#061827] p-6 text-white">
              <Clock3 className="h-6 w-6 text-[#24C8EE]" />
              <p className="mt-4 text-xl font-bold">Para atencion inmediata, usa el chat tecnico en la esquina inferior.</p>
              <p className="mt-2 text-sm leading-6 text-white/66">El equipo puede asignar tu conversacion a ventas, soporte, campo o alquiler segun el tema.</p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={120}>
          <div className="lg:sticky lg:top-24">
            <ContactForm />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
