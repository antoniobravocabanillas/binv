import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [productCount, pendingOrders, newLeads, messageCount, recentLeads] = await prisma.$transaction([
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Panel administrativo</h1>
          <p className="mt-2 text-muted-foreground">Resumen comercial y operativo de ICC Topografia.</p>
        </div>
        <Button asChild><Link href="/admin/leads">Ver leads</Link></Button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["Productos", productCount, "Catalogo tecnico"],
          ["Pedidos pendientes", pendingOrders, "Ordenes por revisar"],
          ["Leads nuevos", newLeads, "Cotizaciones entrantes"],
          ["Mensajes", messageCount, "Contacto general"]
        ].map(([title, value, text]) => (
          <Card key={String(title)}>
            <CardHeader>
              <CardDescription>{text}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
              <p className="text-sm font-semibold">{title}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Leads recientes</CardTitle>
          <CardDescription>Ultimas solicitudes de cotizacion registradas desde la web.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Origen</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </td>
                    <td className="p-3">{lead.company || "-"}</td>
                    <td className="p-3">{lead.source || "web"}</td>
                    <td className="p-3"><StatusBadge status={lead.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
