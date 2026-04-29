import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Terminos y condiciones", description: "Terminos comerciales de tienda, cotizacion, servicios y soporte.", path: "/terminos" });

export default function TermsPage() {
  return (
    <section className="container max-w-3xl py-16">
      <h1 className="text-4xl font-bold">Terminos y condiciones</h1>
      <p className="mt-5 leading-7 text-muted-foreground">Las condiciones de compra, garantia, alquiler, entrega y soporte dependen del producto o servicio contratado. Este texto inicial debe ser reemplazado por condiciones legales definitivas antes de produccion.</p>
    </section>
  );
}
