import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { faqs } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Preguntas frecuentes", description: "Preguntas frecuentes sobre servicios, cotizaciones, tienda, calibracion y soporte.", path: "/faq" });

export default function FaqPage() {
  return (
    <section className="container py-16">
      <SectionHeading eyebrow="FAQ" title="Respuestas para compra, soporte y contratacion" />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => <Card key={faq.question}><CardHeader><CardTitle>{faq.question}</CardTitle><CardDescription>{faq.answer}</CardDescription></CardHeader></Card>)}
      </div>
    </section>
  );
}
