import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Proyectos y casos de exito", description: "Casos de exito en topografia, georreferenciacion y control geometrico.", path: "/proyectos" });

export default function ProjectsPage() {
  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Proyectos" title="Casos con evidencia tecnica y valor operativo" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title}><CardHeader><CardTitle>{project.title}</CardTitle><CardDescription>{project.summary} Resultado: {project.metric}.</CardDescription></CardHeader></Card>
        ))}
      </div>
    </section>
  );
}
