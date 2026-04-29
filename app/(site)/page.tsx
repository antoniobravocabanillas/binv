import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, SlidersHorizontal, Wrench } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversionBand } from "@/components/conversion-band";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, products } from "@/lib/content/products";
import { faqs, operatingStandard, partners, projects, testimonials } from "@/lib/content/site";
import { services } from "@/lib/content/services";
import { brand } from "@/lib/brand";

const advantages = [
  { icon: ShieldCheck, title: "Confianza tecnica", text: "Trazabilidad, certificados, QA/QC y entregables consistentes." },
  { icon: SlidersHorizontal, title: "Configuracion correcta", text: "Equipos, accesorios, software y capacitacion alineados al uso real." },
  { icon: Wrench, title: "Servicio postventa", text: "Mantenimiento, calibracion, soporte remoto y atencion de incidencias." },
  { icon: CheckCircle2, title: "Compra B2B ordenada", text: "Cotizaciones claras para compras corporativas y proyectos exigentes." }
];

export default function HomePage() {
  return (
    <>
      <section className="technical-grid border-b">
        <div className="container grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge variant="accent">{brand.descriptor}</Badge>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.02] md:text-6xl">
              Ingenieria y topografia profesional para construir, medir y decidir con precision.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {brand.name} integra servicios de campo, consultoria, venta de equipos, soporte, calibracion y capacitacion para proyectos que necesitan datos confiables y respaldo especializado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/cotizacion">Solicitar cotizacion <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tienda">Ver tienda tecnica</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51999999999"}`}>
                  <MessageCircle className="h-4 w-4" />
                  Hablar con asesor
                </a>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-technical">
            <div className="rounded-md bg-[#063D63] p-6 text-white">
              <BrandLogo className="h-28 w-full" priority />
              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-white/65">{brand.tagline}</p>
              <div className="mt-6 grid gap-4">
                {[
                  ["12+", "años de experiencia tecnica"],
                  ["QA/QC", "entregables auditables"],
                  ["B2B", "compras, alquiler y soporte"],
                  ["360°", "servicios, equipos y calibracion"]
                ].map(([value, label]) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/12 pb-3">
                    <span className="text-3xl font-bold text-[#12B5DC]">{value}</span>
                    <span className="text-sm text-white/72">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading eyebrow="Servicios destacados" title="Cobertura tecnica de campo, gabinete y soporte" description="Servicios diseñados para reducir riesgo operativo, mejorar trazabilidad y acelerar decisiones tecnicas." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 8).map((service) => (
            <Card key={service.slug}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/servicios/${service.slug}`}>Ver servicio</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-white/72 py-16">
        <div className="container">
          <SectionHeading eyebrow="Tienda tecnica" title="Categorias preparadas para compra consultiva" description="Catalogo pensado para instrumentos de ticket alto, productos con precio y soluciones que requieren cotizacion." />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 12).map((category) => (
              <Link key={category} href={`/tienda?categoria=${encodeURIComponent(category)}`} className="rounded-md border bg-background p-4 font-semibold hover:border-primary">
                {category}
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading eyebrow="Ventajas competitivas" title="La venta tecnica no termina en la factura" description="Cada compra, alquiler o servicio se acompaña con criterio de aplicacion, puesta en marcha y respaldo postventa." />
        <div className="grid gap-4 sm:grid-cols-2">
          {advantages.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-[#063D63] py-16 text-white">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge className="bg-[#12B5DC] text-white">{operatingStandard.kicker}</Badge>
            <h2 className="mt-5 font-display text-3xl font-bold md:text-4xl">{operatingStandard.title}</h2>
            <p className="mt-5 text-base leading-7 text-white/76">{operatingStandard.description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {operatingStandard.metrics.map(([value, label]) => (
                <div key={label} className="rounded-md border border-white/15 bg-white/8 p-4">
                  <p className="text-3xl font-bold text-[#12B5DC]">{value}</p>
                  <p className="mt-1 text-sm text-white/72">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {operatingStandard.credentials.map((credential) => (
              <div key={credential} className="rounded-md border border-white/15 bg-white/8 p-4 text-sm leading-6 text-white/82">
                {credential}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-white/72 py-16">
        <div className="container">
          <SectionHeading eyebrow="Partners y marcas" title="Ecosistema de instrumentacion profesional" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => <div key={partner} className="rounded-md border bg-background p-4 text-center text-sm font-semibold">{partner}</div>)}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading eyebrow="Casos de exito" title="Proyectos donde la precision tiene impacto comercial" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title}>
              <CardHeader>
                <Badge variant="outline">{project.sector}</Badge>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{project.metric}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-white/72 py-16">
        <div className="container grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.author} className="rounded-lg border bg-background p-6 shadow-technical">
              <p className="text-lg leading-8">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-5 text-sm text-muted-foreground">{testimonial.author} · {testimonial.company}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading eyebrow="FAQ" title="Preguntas frecuentes antes de cotizar" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle>{faq.question}</CardTitle>
                <CardDescription>{faq.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <ConversionBand />
    </>
  );
}
