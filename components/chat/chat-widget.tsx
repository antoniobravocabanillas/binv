"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
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

type ChatAssignee = {
  name?: string | null;
  email?: string | null;
};

type ChatProfile = {
  displayName: string;
  roleTitle: string;
  department: string;
};

type ChatConversation = {
  id: string;
  status: "WAITING" | "ACTIVE" | "CLOSED";
  topic?: string | null;
  assignedTo?: ChatAssignee | null;
  assignedProfile?: ChatProfile | null;
  messages: ChatMessage[];
};

const storageKey = "icc-chat-conversation-id";

const topics = [
  "Cotizacion de equipos",
  "Servicio topografico",
  "Soporte tecnico",
  "Alquiler de equipos",
  "Mantenimiento y calibracion",
  "Capacitacion"
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const startFormRef = useRef<HTMLFormElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const assignedName = conversation?.assignedProfile?.displayName || conversation?.assignedTo?.name || conversation?.assignedTo?.email || "";
  const assignedRole = conversation?.assignedProfile?.roleTitle || "Asesor tecnico";
  const hasAdminReply = Boolean(conversation?.messages.some((message) => message.sender === "admin"));
  const isOnline = conversation?.status === "ACTIVE" || hasAdminReply;
  const waitingNotice = conversationId && conversation?.status !== "CLOSED" && !hasAdminReply
    ? assignedName
      ? `${assignedName} ya fue asignado a tu solicitud. Permanece en linea, te respondera en breve.`
      : "Solicitud recibida. No cierres esta ventana; un asesor tomara tu conversacion en linea desde nuestro admin."
    : "";

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
    const interval = window.setInterval(loadConversation, 3000);
    return () => window.clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length, open]);

  function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function startConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/chat", { method: "POST", body: formData });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(result?.error?.message || "No pudimos iniciar el chat. Intentalo nuevamente.");
      return;
    }

    const id = result?.conversationId as string;
    window.localStorage.setItem(storageKey, id);
    setConversationId(id);
    setConversation(result.conversation);
    startFormRef.current?.reset();
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!conversationId || loading || !messageBody.trim()) return;

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("body", messageBody.trim());
    const response = await fetch("/api/chat", { method: "POST", body: formData });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(result?.error?.message || "No pudimos enviar el mensaje.");
      return;
    }

    setMessageBody("");
    const refreshed = await fetch(`/api/chat?conversationId=${conversationId}`, { cache: "no-store" });
    const refreshedResult = await refreshed.json().catch(() => null);
    if (refreshed.ok && refreshedResult?.conversation) setConversation(refreshedResult.conversation);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <section className="mb-3 w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-xl border bg-background shadow-2xl">
          <header className="flex items-center justify-between bg-[#063D63] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">{assignedName || "Asesor tecnico ICC"}</p>
              <p className="text-xs text-white/70">
                {conversation?.status === "CLOSED" ? "Conversacion cerrada" : isOnline ? `${assignedRole} en linea` : assignedName ? "Perfil asignado" : "Esperando asesor"}
              </p>
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
                      {message.sender === "admin" ? <p className="mb-1 text-[11px] font-bold uppercase opacity-60">{assignedName || "ICC Topografia"}</p> : null}
                      <p className="whitespace-pre-line leading-5">{message.body}</p>
                    </div>
                  ))}
                </div>
                {waitingNotice ? <p className="rounded-md bg-primary/10 p-3 text-xs leading-5 text-primary">{waitingNotice}</p> : null}
                {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    name="body"
                    placeholder="Escribe tu mensaje"
                    disabled={conversation?.status === "CLOSED"}
                    value={messageBody}
                    onChange={(event) => setMessageBody(event.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={loading || conversation?.status === "CLOSED" || !messageBody.trim()} aria-label="Enviar mensaje">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <form ref={startFormRef} onSubmit={startConversation} className="grid gap-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Inicia una conversacion comercial. Te pediremos que permanezcas en linea hasta que un asesor tome el caso.
                </p>
                <Input required name="name" placeholder="Nombre y apellido" autoComplete="name" />
                <Input name="email" type="email" placeholder="Correo corporativo" autoComplete="email" />
                <Input name="phone" placeholder="Telefono / WhatsApp" autoComplete="tel" />
                <select name="topic" defaultValue="Cotizacion de equipos" className="h-11 rounded-md border bg-background px-3 text-sm">
                  {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                </select>
                <Textarea required name="body" placeholder="Cuentanos que equipo, servicio o soporte necesitas" onKeyDown={submitOnEnter} />
                <Button type="submit" disabled={loading}>{loading ? "Iniciando..." : "Iniciar chat"}</Button>
                {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
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
