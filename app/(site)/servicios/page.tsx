import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Servicios de topografia y soporte tecnico",
  description: "Servicios de levantamiento topografico, georreferenciacion, replanteo, control geometrico, alquiler, calibracion, capacitacion y soporte.",
  path: "/servicios"
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Servicios" title="Soluciones tecnicas para campo, gabinete y operacion" description="Cada servicio esta estructurado para generar entregables claros, trazabilidad y soporte comercial especializado." />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.slug}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/servicios/${service.slug}`} className="inline-flex items-center gap-2 font-semibold text-primary">
                Ver detalle <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
