import { Building2, FileText, LifeBuoy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/server/admin-page-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminClientsPage() {
  await requireAdminPage(["SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN", "SUPPORT"]);
  const clients = await prisma.client.findMany({
    include: {
      leads: true,
      quotes: true,
      projects: true
    },
    orderBy: { updatedAt: "desc" },
    take: 120
  });

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Portal de clientes - base</p>
        <h1 className="font-display text-3xl font-bold">Clientes</h1>
        <p className="mt-2 text-muted-foreground">Historial comercial consolidado para compras, cotizaciones, proyectos y soporte futuro.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Metric icon={Building2} label="Clientes/prospectos" value={clients.length} />
        <Metric icon={FileText} label="Cotizaciones asociadas" value={clients.reduce((sum, client) => sum + client.quotes.length, 0)} />
        <Metric icon={LifeBuoy} label="Base soporte" value="Preparado" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directorio comercial</CardTitle>
          <CardDescription>Los clientes se crean automaticamente desde cotizaciones y se podran ampliar desde el portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Leads</th>
                  <th className="p-3">Cotizaciones</th>
                  <th className="p-3">Proyectos</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-t">
                    <td className="p-3 font-medium">{client.name}</td>
                    <td className="p-3">{client.company || "-"}</td>
                    <td className="p-3">
                      <div>{client.email}</div>
                      <div className="text-xs text-muted-foreground">{client.phone || "-"}</div>
                    </td>
                    <td className="p-3 capitalize">{client.status}</td>
                    <td className="p-3">{client.leads.length}</td>
                    <td className="p-3">{client.quotes.length}</td>
                    <td className="p-3">{client.projects.length}</td>
                  </tr>
                ))}
                {!clients.length ? <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Aun no hay clientes registrados.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <Icon className="h-5 w-5 text-primary" />
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
