import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import {
  closeChatConversationAction,
  deleteChatConversationAction,
  sendAdminChatMessageAction,
  takeChatConversationAction
} from "@/lib/server/admin-actions";

const statusLabels = {
  WAITING: "Esperando asesor",
  ACTIVE: "En linea",
  CLOSED: "Cerrada"
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminChatPage() {
  const conversations = await prisma.chatConversation.findMany({
    include: {
      assignedTo: true,
      messages: { orderBy: { createdAt: "asc" } }
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    take: 80
  });

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Atencion comercial</p>
        <h1 className="font-display text-3xl font-bold">Chat en linea</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Toma conversaciones iniciadas desde el front, responde en vivo y cierra los casos atendidos.
        </p>
      </div>

      <div className="grid gap-5">
        {conversations.length ? conversations.map((conversation) => {
          const takeAction = takeChatConversationAction.bind(null, conversation.id);
          const closeAction = closeChatConversationAction.bind(null, conversation.id);
          const deleteAction = deleteChatConversationAction.bind(null, conversation.id);
          const replyAction = sendAdminChatMessageAction.bind(null, conversation.id);

          return (
            <Card key={conversation.id}>
              <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{conversation.customerName}</CardTitle>
                  <CardDescription>
                    {[conversation.customerEmail, conversation.customerPhone].filter(Boolean).join(" · ") || "Sin datos adicionales"}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {statusLabels[conversation.status]}
                  </span>
                  {conversation.assignedTo ? (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {conversation.assignedTo.email}
                    </span>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[360px] space-y-3 overflow-auto rounded-lg border bg-muted/30 p-4">
                  {conversation.messages.map((message) => (
                    <div key={message.id} className={message.sender === "admin" ? "ml-auto max-w-[78%] rounded-lg bg-primary p-3 text-primary-foreground" : "max-w-[78%] rounded-lg bg-background p-3"}>
                      <p className="text-xs font-semibold uppercase opacity-70">{message.sender === "admin" ? "Admin" : "Cliente"}</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-6">{message.body}</p>
                      <p className="mt-2 text-[11px] opacity-60">{message.createdAt.toLocaleString("es-PE")}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                  <form action={replyAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <Textarea name="body" placeholder="Escribe una respuesta para el cliente" className="min-h-20" />
                    <Button type="submit">Responder</Button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {conversation.status !== "ACTIVE" ? (
                      <form action={takeAction}>
                        <Button type="submit" variant="secondary">
                          <MessageCircle className="h-4 w-4" />
                          Tomar chat
                        </Button>
                      </form>
                    ) : null}
                    {conversation.status !== "CLOSED" ? (
                      <form action={closeAction}>
                        <Button type="submit" variant="outline">Cerrar</Button>
                      </form>
                    ) : null}
                    <form action={deleteAction}>
                      <Button type="submit" variant="destructive" size="icon" aria-label="Eliminar conversacion">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <Card>
            <CardContent className="p-8 text-muted-foreground">Todavia no hay conversaciones iniciadas desde el front.</CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
