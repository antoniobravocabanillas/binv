import { ShoppingCart } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Checkout", description: "Checkout para compra o solicitud comercial de productos tecnicos.", path: "/checkout" });

export default function CheckoutPage() {
  return (
    <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_460px]">
      <div>
        <h1 className="text-4xl font-bold">Checkout consultivo</h1>
        <Card className="mt-8">
          <CardHeader>
            <ShoppingCart className="h-6 w-6 text-primary" />
            <CardTitle>Carrito preparado para integracion</CardTitle>
            <CardDescription>La estructura de pedidos ya esta modelada en Prisma. El siguiente paso es conectar estado global de carrito, pasarela de pago y reglas comerciales por producto.</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <ContactForm intent="quote" context="Checkout consultivo" />
    </section>
  );
}
