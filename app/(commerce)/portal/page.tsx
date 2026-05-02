import Link from "next/link";
import { redirect } from "next/navigation";
import type { ElementType } from "react";
import { FileText, FolderKanban, LifeBuoy, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { createCustomerTicketAction, replyCustomerTicketAction, respondPublicQuoteFromFormAction, updateClientProfileAction } from "@/lib/server/customer-actions";
import { createMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Portal de cliente",
  description: "Cotizaciones, proyectos, documentos y tickets de soporte para clientes ICC.",
  path: "/portal"
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ticketCategories = [
  ["EQUIPMENT", "Equipo"],
  ["SERVICE", "Servicio"],
  ["CALIBRATION", "Calibracion"],
  ["REPAIR", "Reparacion"],
  ["WARRANTY", "Garantia"],
  ["TECHNICAL_QUERY", "Consulta tecnica"],
  ["OTHER", "Otro"]
];

export default async function ClientPortalPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/cuenta?callbackUrl=/portal");

  const client = await prisma.client.upsert({
    where: { email: session.user.email },
    update: { userId: session.user.id },
    create: {
      userId: session.user.id,
      name: session.user.name || session.user.email,
      email: session.user.email,
      contactName: session.user.name || session.user.email
    },
    include: {
      quotes: { include: { items: true, sellerProfile: true }, orderBy: { createdAt: "desc" } },
      projects: { include: { images: { orderBy: { position: "asc" }, take: 1 }, progress: { orderBy: { createdAt: "desc" }, take: 3 } }, orderBy: { updatedAt: "desc" } },
      tickets: { include: { assignedProfile: true, messages: { orderBy: { createdAt: "asc" } } }, orderBy: { updatedAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } }
    }
  });

  return (
    <section className="bg-[#f6fbff] py-12">
      <div className="container space-y-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border bg-[#03111D] p-7 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24C8EE]">Portal ICC</p>
            <h1 className="mt-4 font-display text-4xl font-bold">Operacion del cliente</h1>
            <p className="mt-4 max-w-2xl text-white/72">
              Consulta tus cotizaciones, tickets de soporte, proyectos contratados y documentos comerciales en un solo lugar.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric icon={FileText} label="Cotizaciones" value={client.quotes.length} />
              <Metric icon={LifeBuoy} label="Tickets" value={client.tickets.length} />
              <Metric icon={FolderKanban} label="Proyectos" value={client.projects.length} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perfil comercial</CardTitle>
              <CardDescription>Datos usados para propuestas, tickets y seguimiento.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateClientProfileAction} className="grid gap-3">
                <Input name="name" defaultValue={client.name} placeholder="Nombre" />
                <Input name="company" defaultValue={client.company || ""} placeholder="Empresa" />
                <Input name="document" defaultValue={client.document || ""} placeholder="RUC / DNI" />
                <Input name="phone" defaultValue={client.phone || ""} placeholder="Telefono" />
                <Input name="address" defaultValue={client.address || ""} placeholder="Direccion" />
                <Input name="contactName" defaultValue={client.contactName || ""} placeholder="Contacto principal" />
                <Button type="submit">Actualizar perfil</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones recibidas</CardTitle>
              <CardDescription>Acepta, rechaza o descarga tus propuestas comerciales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.quotes.map((quote) => (
                <div key={quote.id} className="rounded-lg border bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-display text-xl font-bold">{quote.number}</p>
                      <p className="text-sm text-muted-foreground">{quote.items.map((item) => item.description).join(", ")}</p>
                      <p className="mt-2 text-sm">Asesor: {quote.sellerProfile?.displayName || "Equipo ICC"}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <StatusBadge status={quote.status} />
                      <p className="mt-2 font-display text-2xl font-bold">{formatCurrency(Number(quote.total), quote.currency)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {quote.publicToken ? <Button asChild variant="outline" size="sm"><Link href={`/cotizaciones/${quote.publicToken}`}>Ver detalle</Link></Button> : null}
                    <Button asChild variant="outline" size="sm"><Link href={`/api/quotes/${quote.id}/pdf`} target="_blank">Descargar PDF</Link></Button>
                    {quote.publicToken ? (
                      <>
                        <form action={respondPublicQuoteFromFormAction.bind(null, quote.publicToken)}>
                          <input type="hidden" name="status" value="ACCEPTED" />
                          <Button type="submit" size="sm">Aceptar</Button>
                        </form>
                        <form action={respondPublicQuoteFromFormAction.bind(null, quote.publicToken)}>
                          <input type="hidden" name="status" value="REJECTED" />
                          <Button type="submit" size="sm" variant="outline">Rechazar</Button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
              {!client.quotes.length ? <p className="text-sm text-muted-foreground">Aun no tienes cotizaciones registradas.</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuevo ticket de soporte</CardTitle>
              <CardDescription>Solicita asistencia, calibracion, garantia o revision tecnica.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createCustomerTicketAction} className="grid gap-3">
                <Input name="subject" placeholder="Asunto" required />
                <select name="category" className="h-11 rounded-md border bg-background px-3 text-sm">
                  {ticketCategories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select name="priority" className="h-11 rounded-md border bg-background px-3 text-sm">
                  <option value="MEDIUM">Prioridad media</option>
                  <option value="LOW">Baja</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
                <Textarea name="description" placeholder="Describe el equipo, servicio, falla o alcance solicitado" required />
                <Textarea name="attachments" placeholder="URLs de fotos o archivos, uno por linea" />
                <Button type="submit">Crear ticket</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tickets activos</CardTitle>
            <CardDescription>Historial de respuestas entre tu equipo y soporte ICC.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {client.tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-display text-lg font-bold">{ticket.code} - {ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">Responsable: {ticket.assignedProfile?.displayName || "Pendiente de asignacion"}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="mt-4 grid gap-2">
                  {ticket.messages.map((message) => (
                    <div key={message.id} className="rounded-md bg-muted/50 p-3 text-sm">
                      <p className="font-semibold">{message.sender === "staff" ? "ICC" : "Cliente"}</p>
                      <p className="mt-1 text-muted-foreground">{message.body}</p>
                    </div>
                  ))}
                </div>
                <form action={replyCustomerTicketAction.bind(null, ticket.id)} className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                  <Input name="body" placeholder="Responder ticket" />
                  <Button type="submit" variant="outline">Enviar</Button>
                </form>
              </div>
            ))}
            {!client.tickets.length ? <p className="text-sm text-muted-foreground">Todavia no tienes tickets.</p> : null}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos contratados</CardTitle>
              <CardDescription>Avances, estado y evidencia tecnica asociada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.projects.map((project) => (
                <div key={project.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-bold">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.location || "Sin ubicacion"} | {project.servicesApplied.join(", ")}</p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  {project.progress.length ? (
                    <div className="mt-3 space-y-2">
                      {project.progress.map((entry) => (
                        <p key={entry.id} className="rounded-md bg-muted/50 p-3 text-sm">{entry.title}: {entry.body}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {!client.projects.length ? <p className="text-sm text-muted-foreground">No hay proyectos vinculados todavia.</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Fichas, informes, contratos o entregables compartidos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.documents.map((document) => (
                <Link key={document.id} href={document.url} target="_blank" className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50">
                  <UserRound className="h-4 w-4 text-primary" />
                  <span className="font-medium">{document.title}</span>
                </Link>
              ))}
              {!client.documents.length ? <p className="text-sm text-muted-foreground">No hay documentos compartidos.</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: ElementType; label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/12 bg-white/[0.06] p-4">
      <Icon className="h-5 w-5 text-[#24C8EE]" />
      <p className="mt-4 font-display text-3xl font-bold">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}
