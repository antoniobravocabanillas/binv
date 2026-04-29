import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Cuenta de usuario", description: "Acceso de usuarios, pedidos, favoritos y cotizaciones.", path: "/cuenta" });

export default function AccountPage() {
  return (
    <section className="container max-w-3xl py-16">
      <h1 className="text-4xl font-bold">Cuenta de usuario</h1>
      <p className="mt-5 leading-7 text-muted-foreground">Area preparada para login con NextAuth, historial de pedidos, favoritos, direcciones y solicitudes de cotizacion.</p>
    </section>
  );
}
