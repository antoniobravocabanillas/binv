import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <section>
      <div>
        <h1 className="font-display text-3xl font-bold">Leads y cotizaciones</h1>
        <p className="mt-2 text-muted-foreground">Bandeja comercial para solicitudes de cotizacion y oportunidades nuevas.</p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Solicitudes registradas</CardTitle>
          <CardDescription>{leads.length} solicitudes encontradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Mensaje</th>
                  <th className="p-3">Origen</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t align-top">
                    <td className="p-3 text-muted-foreground">{lead.createdAt.toLocaleString("es-PE")}</td>
                    <td className="p-3 font-medium">{lead.name}</td>
                    <td className="p-3">
                      <div>{lead.email}</div>
                      <div className="text-xs text-muted-foreground">{lead.phone || "-"}</div>
                    </td>
                    <td className="p-3">{lead.company || "-"}</td>
                    <td className="max-w-sm p-3 leading-6">{lead.message}</td>
                    <td className="max-w-xs p-3 text-xs leading-5">{lead.source || "web"}</td>
                    <td className="p-3"><StatusBadge status={lead.status} /></td>
                  </tr>
                ))}
                {!leads.length ? (
                  <tr>
                    <td className="p-6 text-center text-muted-foreground" colSpan={7}>Todavia no hay solicitudes registradas.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
