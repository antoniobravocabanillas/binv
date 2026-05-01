import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { deleteLeadAction, updateLeadStatusAction } from "@/lib/server/admin-actions";

const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;

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
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const statusAction = updateLeadStatusAction.bind(null, lead.id);
                  const deleteAction = deleteLeadAction.bind(null, lead.id);
                  return (
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
                      <td className="space-y-2 p-3">
                        <form action={statusAction} className="flex gap-2">
                          <select name="status" defaultValue={lead.status} className="h-9 rounded-md border bg-background px-2 text-xs">
                            {leadStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                          <Button type="submit" size="sm" variant="outline">Guardar</Button>
                        </form>
                        <form action={deleteAction}>
                          <Button type="submit" size="sm" variant="destructive">Eliminar</Button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
                {!leads.length ? (
                  <tr>
                    <td className="p-6 text-center text-muted-foreground" colSpan={8}>Todavia no hay solicitudes registradas.</td>
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
