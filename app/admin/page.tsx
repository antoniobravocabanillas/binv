import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/server/admin-page-auth";

export default async function AdminPage() {
  const session = await requireAdminPage(["TECHNICIAN", "SALES", "EDITOR", "ADMIN"]);
  if (session.user.role === "TECHNICIAN") {
    const profile = await prisma.staffProfile.findUnique({ where: { userId: session.user.id } });
    const assignedChats = profile
      ? await prisma.chatConversation.findMany({
          where: { assignedProfileId: profile.id },
          include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
          orderBy: { updatedAt: "desc" },
          take: 8
        })
      : [];

    return (
      <section>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold">Panel tecnico</h1>
            <p className="mt-2 text-muted-foreground">{profile ? `Bandeja de ${profile.displayName}` : "Tu usuario aun no tiene perfil vinculado."}</p>
          </div>
          <Button asChild><Link href="/admin/chat">Ver mis chats</Link></Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Asignados a tu perfil</CardDescription>
              <CardTitle className="text-3xl">{assignedChats.length}</CardTitle>
              <p className="text-sm font-semibold">Chats</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Perfil operativo</CardDescription>
              <CardTitle className="text-xl">{profile?.roleTitle || "Sin perfil"}</CardTitle>
              <p className="text-sm font-semibold">Especialidad</p>
            </CardHeader>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Mis chats recientes</CardTitle>
            <CardDescription>Conversaciones asignadas por administracion comercial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedChats.map((chat) => (
              <div key={chat.id} className="rounded-md border p-3">
                <p className="font-semibold">{chat.customerName}</p>
                <p className="text-sm text-muted-foreground">{chat.topic || "Consulta general"} | {chat.status}</p>
              </div>
            ))}
            {!assignedChats.length ? <p className="text-sm text-muted-foreground">Todavia no tienes chats asignados.</p> : null}
          </CardContent>
        </Card>
      </section>
    );
  }

  const [productCount, pendingOrders, newLeads, waitingChats, recentLeads] = await prisma.$transaction([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.chatConversation.count({ where: { status: "WAITING" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Panel administrativo</h1>
          <p className="mt-2 text-muted-foreground">Resumen comercial y operativo de ICC Topografia.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/admin/chat">Ver chat</Link></Button>
          <Button asChild><Link href="/admin/leads">Ver leads</Link></Button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["Productos", productCount, "Catalogo tecnico"],
          ["Pedidos pendientes", pendingOrders, "Ordenes por revisar"],
          ["Leads nuevos", newLeads, "Cotizaciones entrantes"],
          ["Chats esperando", waitingChats, "Atencion en linea"]
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
