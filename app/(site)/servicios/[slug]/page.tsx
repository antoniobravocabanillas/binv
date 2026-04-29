import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/contact-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/content/services";
import { createMetadata } from "@/lib/seo";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return createMetadata({ title: service.title, description: service.summary, path: `/servicios/${service.slug}` });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_380px]">
      <div>
        <Badge variant="accent">Servicio especializado</Badge>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">{service.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{service.summary}</p>
        <div className="mt-10 grid gap-5">
          <Card>
            <CardHeader><CardTitle>Problema que resuelve</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">{service.problem}</CardContent>
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            <InfoList title="Beneficios" items={service.benefits} />
            <InfoList title="Proceso de trabajo" items={service.process} />
            <InfoList title="Entregables" items={service.deliverables} />
            <InfoList title="Equipamiento aplicable" items={service.equipment} />
          </div>
        </div>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ContactForm intent="service" context={service.title} />
      </aside>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
          {items.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
