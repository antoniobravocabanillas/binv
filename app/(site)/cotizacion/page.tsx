import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Solicitar cotizacion", description: "Solicita cotizacion para servicios topograficos, equipos, alquiler, calibracion o soporte tecnico.", path: "/cotizacion" });

export default function QuotePage() {
  return (
    <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_480px]">
      <SectionHeading eyebrow="Cotizacion" title="Recibe una propuesta tecnica y comercial clara" description="Incluye alcance, plazos, equipos recomendados, condiciones comerciales y siguientes pasos para tu proyecto o compra." />
      <ContactForm intent="quote" context="Cotizacion general" />
    </section>
  );
}
