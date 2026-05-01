"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  id: string;
  sender: string;
  body: string;
  createdAt: string;
};

type ChatConversation = {
  id: string;
  status: "WAITING" | "ACTIVE" | "CLOSED";
  messages: ChatMessage[];
};

const storageKey = "icc-chat-conversation-id";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setConversationId(stored);
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    async function loadConversation() {
      const response = await fetch(`/api/chat?conversationId=${conversationId}`, { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (response.ok && result?.conversation) setConversation(result.conversation);
    }

    loadConversation();
    const interval = window.setInterval(loadConversation, 4000);
    return () => window.clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length, open]);

  async function startConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setNotice("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/chat", { method: "POST", body: formData });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setNotice(result?.error?.message || "No pudimos iniciar el chat. Intentalo nuevamente.");
      return;
    }

    const id = result?.conversationId as string;
    window.localStorage.setItem(storageKey, id);
    setConversationId(id);
    setConversation(result.conversation);
    setNotice("Solicitud recibida. No cierres esta ventana; un asesor tomara tu conversacion en linea desde nuestro admin.");
    event.currentTarget.reset();
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!conversationId || loading) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set("conversationId", conversationId);
    const response = await fetch("/api/chat", { method: "POST", body: formData });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setNotice(result?.error?.message || "No pudimos enviar el mensaje.");
      return;
    }

    event.currentTarget.reset();
    const refreshed = await fetch(`/api/chat?conversationId=${conversationId}`, { cache: "no-store" });
    const refreshedResult = await refreshed.json().catch(() => null);
    if (refreshed.ok && refreshedResult?.conversation) setConversation(refreshedResult.conversation);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <section className="mb-3 w-[calc(100vw-2.5rem)] max-w-[380px] overflow-hidden rounded-xl border bg-background shadow-2xl">
          <header className="flex items-center justify-between bg-[#063D63] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Asesor tecnico ICC</p>
              <p className="text-xs text-white/70">{conversation?.status === "ACTIVE" ? "Conversacion en linea" : conversation?.status === "CLOSED" ? "Conversacion cerrada" : "Esperando toma del asesor"}</p>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Cerrar chat" className="text-white hover:bg-white/10" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="space-y-4 p-4">
            {conversationId ? (
              <>
                <div ref={messagesRef} className="max-h-72 space-y-3 overflow-auto rounded-lg bg-muted/40 p-3">
                  {conversation?.messages.map((message) => (
                    <div key={message.id} className={message.sender === "admin" ? "mr-auto max-w-[85%] rounded-lg bg-white p-3 text-sm shadow-sm" : "ml-auto max-w-[85%] rounded-lg bg-primary p-3 text-sm text-primary-foreground"}>
                      <p className="whitespace-pre-line leading-5">{message.body}</p>
                    </div>
                  ))}
                </div>
                {notice ? <p className="rounded-md bg-primary/10 p-3 text-xs leading-5 text-primary">{notice}</p> : null}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input name="body" placeholder="Escribe tu mensaje" disabled={conversation?.status === "CLOSED"} />
                  <Button type="submit" size="icon" disabled={loading || conversation?.status === "CLOSED"} aria-label="Enviar mensaje">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <form onSubmit={startConversation} className="grid gap-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Inicia una conversacion comercial. Te pediremos que permanezcas en linea hasta que un asesor tome el caso.
                </p>
                <Input required name="name" placeholder="Nombre y apellido" autoComplete="name" />
                <Input name="email" type="email" placeholder="Correo corporativo" autoComplete="email" />
                <Input name="phone" placeholder="Telefono / WhatsApp" autoComplete="tel" />
                <Textarea required name="body" placeholder="Cuéntanos qué equipo, servicio o soporte necesitas" />
                <Button type="submit" disabled={loading}>{loading ? "Iniciando..." : "Iniciar chat"}</Button>
                {notice ? <p className="text-xs font-medium text-destructive">{notice}</p> : null}
              </form>
            )}
          </div>
        </section>
      ) : null}

      <Button type="button" className="h-14 rounded-full px-5 shadow-2xl" onClick={() => setOpen((value) => !value)}>
        <MessageCircle className="h-5 w-5" />
        Chat tecnico
      </Button>
    </div>
  );
}
