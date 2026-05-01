import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Radar, Ruler, ShieldCheck, SlidersHorizontal, Wrench } from "lucide-react";
import { HomeHero3D } from "@/components/home-hero-3d";
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

const heroMetrics = [
  { icon: Ruler, value: "12+", label: "anos de experiencia tecnica" },
  { icon: Radar, value: "QA/QC", label: "entregables auditables" },
  { icon: ShieldCheck, value: "B2B", label: "compras, alquiler y soporte" },
  { icon: SlidersHorizontal, value: "360", label: "servicios, equipos y calibracion" }
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b bg-[#03111D] text-white">
        <HomeHero3D />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,17,29,0.96)_0%,rgba(3,17,29,0.78)_42%,rgba(3,17,29,0.18)_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(36,200,238,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(36,200,238,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="container relative grid min-h-[calc(100svh-8rem)] items-center gap-10 py-12 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="max-w-3xl">
            <Badge className="bg-white text-[#063D63] hover:bg-white">{brand.descriptor}</Badge>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.96] text-white md:text-7xl">
              ICC Topografia Group S.A.C.
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-semibold leading-tight text-[#7DE4FF] md:text-3xl">
              Topografia, geodesia e instrumentacion para proyectos criticos.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
              Integramos servicios de campo, consultoria, venta tecnica, alquiler, calibracion y soporte para obras que necesitan datos confiables, equipos correctos y trazabilidad real.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/cotizacion">Solicitar cotizacion <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tienda">Ver tienda tecnica</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/35 bg-white/10 text-white hover:bg-white/18">
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51999999999"}`}>
                  <MessageCircle className="h-4 w-4" />
                  Hablar con asesor
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden justify-self-end lg:block">
            <div className="w-[390px] border-y border-white/18 py-5 text-white">
              <p className="text-xs font-semibold uppercase text-white/58">{brand.tagline}</p>
              <div className="mt-5 grid gap-5">
                {heroMetrics.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="grid grid-cols-[34px_96px_1fr] items-center gap-4 border-b border-white/12 pb-4 last:border-b-0 last:pb-0">
                    <Icon className="h-5 w-5 text-[#24C8EE]" />
                    <span className="font-display text-3xl font-bold text-[#24C8EE]">{value}</span>
                    <span className="text-sm text-white/72">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading eyebrow="Servicios destacados" title="Cobertura tecnica de campo, gabinete y soporte" description="Servicios disenados para reducir riesgo operativo, mejorar trazabilidad y acelerar decisiones tecnicas." />
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
        <SectionHeading eyebrow="Ventajas competitivas" title="La venta tecnica no termina en la factura" description="Cada compra, alquiler o servicio se acompana con criterio de aplicacion, puesta en marcha y respaldo postventa." />
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
              <footer className="mt-5 text-sm text-muted-foreground">{testimonial.author} - {testimonial.company}</footer>
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
