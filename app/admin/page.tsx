import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Panel administrativo</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["Productos", "Catalogo, precios, badges y fichas tecnicas"],
          ["Pedidos", "Ordenes, estados, items y clientes"],
          ["Leads", "Cotizaciones, contacto y oportunidades"],
          ["CMS", "Servicios, paginas, blog, banners y FAQ"]
        ].map(([title, text]) => (
          <Card key={title}><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{text}</CardDescription></CardHeader></Card>
        ))}
      </div>
    </section>
  );
}
