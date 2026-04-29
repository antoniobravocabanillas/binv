import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { operatingStandard } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Nosotros",
  description: "Empresa especializada en topografia, geodesia, instrumentacion, venta tecnica y soporte para proyectos de ingenieria.",
  path: "/nosotros"
});

export default function AboutPage() {
  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Nosotros" title="Una operacion tecnica y comercial creada para proyectos exigentes" description={`${brand.name} consolida la experiencia de A&B Topografia Peru en una propuesta corporativa para ingenieria, construccion, consultoria, servicios topograficos e instrumentacion.`} />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["Mision", "Brindar servicios con alto estandar de calidad y seguridad, superando expectativas tecnicas y comerciales."],
          ["Vision", "Ser soporte principal para empresas de ingenieria, construccion y ramas aplicadas a la topografia y geodesia."],
          ["Excelencia con humildad", "Gestion orientada a objetivos, mejora continua, flexibilidad operativa y respeto por la seguridad."]
        ].map(([title, text]) => (
          <Card key={title}><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{text}</CardDescription></CardHeader></Card>
        ))}
      </div>
      <div className="mt-10 rounded-lg border bg-card p-6 shadow-technical">
        <h2 className="text-2xl font-bold">{operatingStandard.title}</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
          {operatingStandard.credentials.map((item) => <li key={item}>- {item}</li>)}
        </ul>
        <a href={brand.legacyBrochure} className="mt-6 inline-flex font-semibold text-primary">Ver brochure historico A&B Topografia</a>
      </div>
    </section>
  );
}
