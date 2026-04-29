import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Politica de privacidad", description: "Politica de privacidad y tratamiento de datos personales.", path: "/privacidad" });

export default function PrivacyPage() {
  return (
    <section className="container max-w-3xl py-16">
      <h1 className="text-4xl font-bold">Politica de privacidad</h1>
      <p className="mt-5 leading-7 text-muted-foreground">Los datos enviados por formularios se utilizan para atender solicitudes comerciales, tecnicas y de soporte. La version legal final debe ser validada por asesoria juridica local antes del despliegue publico.</p>
    </section>
  );
}
