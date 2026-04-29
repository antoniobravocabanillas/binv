import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Contacto", description: "Contacta a un asesor tecnico para servicios, equipos, soporte o proyectos topograficos.", path: "/contacto" });

export default function ContactPage() {
  return (
    <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_460px]">
      <SectionHeading eyebrow="Contacto" title="Habla con un equipo que entiende campo, gabinete y compra B2B" description="Cuéntanos que necesitas y encaminamos tu solicitud al flujo correcto: servicio, producto, soporte, mantenimiento o alquiler." />
      <ContactForm />
    </section>
  );
}
