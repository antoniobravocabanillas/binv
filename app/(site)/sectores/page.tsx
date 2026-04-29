import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { sectors } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Sectores que atendemos", description: "Soluciones topograficas para construccion, mineria, energia, catastro, infraestructura e industria.", path: "/sectores" });

export default function SectorsPage() {
  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Sectores" title="Especializacion para industrias donde la precision impacta costo y seguridad" />
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {sectors.map((sector) => <Card key={sector}><CardHeader><CardTitle className="text-lg">{sector}</CardTitle></CardHeader></Card>)}
      </div>
    </section>
  );
}
