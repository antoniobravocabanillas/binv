import Link from "next/link";
import { ArrowRight, Box, Compass, Crosshair, DraftingCompass, Map, Network, ScanLine, Wrench } from "lucide-react";
import type { Service } from "@/lib/content/services";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-reveal";

const serviceIcons = [Crosshair, Compass, Network, Box, Map, DraftingCompass, ScanLine, Wrench];

export function HomeServicesShowcase({ services }: { services: Service[] }) {
  return (
    <section className="relative overflow-hidden border-y bg-[#03111D] py-20 text-white">
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(36,200,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(36,200,238,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute right-[-8%] top-8 h-[440px] w-[740px] rounded-[50%] border border-[#24C8EE]/20 bg-[radial-gradient(circle_at_center,rgba(36,200,238,0.20),transparent_62%)] blur-sm" />
      <div className="absolute right-[7%] top-16 hidden h-[390px] w-[620px] rotate-[-8deg] overflow-hidden rounded-[48%] border border-white/10 opacity-70 lg:block">
        <div className="absolute inset-0 [background-image:repeating-radial-gradient(ellipse_at_center,rgba(125,228,255,0.24)_0_1px,transparent_1px_17px)]" />
        <div className="absolute inset-x-12 top-1/2 h-px rotate-[-18deg] bg-[#61E8A6]/80 shadow-[0_0_28px_rgba(97,232,166,0.72)]" />
        <div className="absolute left-24 top-28 h-3 w-3 rounded-full bg-[#61E8A6] shadow-[0_0_32px_rgba(97,232,166,0.95)]" />
        <div className="absolute right-28 bottom-24 h-3 w-3 rounded-full bg-[#24C8EE] shadow-[0_0_32px_rgba(36,200,238,0.95)]" />
      </div>

      <div className="container relative">
        <ScrollReveal className="max-w-xl">
          <Badge className="border border-white/12 bg-white/8 text-white hover:bg-white/10">Servicios destacados</Badge>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
            Cobertura tecnica de <span className="text-[#7DE4FF]">campo, gabinete y soporte</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-white/68">
            Servicios disenados para reducir riesgo operativo, mejorar trazabilidad y acelerar decisiones tecnicas en obra, catastro, infraestructura e industria.
          </p>
          <Link href="/servicios" className="mt-8 inline-flex items-center gap-3 border-b border-[#61E8A6] pb-2 text-sm font-semibold text-white">
            Explorar tecnologia y procesos <ArrowRight className="h-4 w-4 text-[#61E8A6]" />
          </Link>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.slice(0, 8).map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <ScrollReveal key={service.slug} delay={index * 55}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group block h-full rounded-lg border border-white/12 bg-white/[0.045] p-6 shadow-[0_22px_70px_-48px_rgba(36,200,238,0.85)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#24C8EE]/60 hover:bg-white/[0.075] motion-reduce:transform-none"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#2D7BFF]/45 bg-[#0B2B54] text-[#61B8FF] shadow-[0_0_28px_rgba(45,123,255,0.22)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold leading-tight text-white">{service.title}</h3>
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/62">{service.summary}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#61B8FF]">
                    Ver servicio <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
