"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  intent?: "contact" | "quote" | "service" | "product";
  context?: string;
  subject?: string;
};

export function ContactForm({ intent = "contact", context, subject }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const submittedRef = useRef(false);

  async function submit(formData: FormData) {
    if (submittedRef.current || status === "loading" || status === "success") return;
    submittedRef.current = true;
    setStatus("loading");

    const endpoint = intent === "quote" || intent === "service" || intent === "product" ? "/api/quote" : "/api/contact";
    formData.set("intent", intent);
    if (context) formData.set("context", context);
    if (subject) formData.set("subject", subject);

    const response = await fetch(endpoint, { method: "POST", body: formData });
    setStatus(response.ok ? "success" : "error");
    if (!response.ok) submittedRef.current = false;
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg border bg-card p-5 shadow-technical">
      {subject ? (
        <div className="rounded-md border bg-muted px-3 py-2 text-sm">
          <span className="font-semibold">Solicitud sobre:</span> {subject}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input required name="name" placeholder="Nombre y apellido" autoComplete="name" />
        <Input required name="email" type="email" placeholder="Correo corporativo" autoComplete="email" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="company" placeholder="Empresa" autoComplete="organization" />
        <Input name="phone" placeholder="Telefono / WhatsApp" autoComplete="tel" />
      </div>
      <Textarea required name="message" placeholder="Cuentanos el equipo, servicio o alcance que necesitas" />
      <Button disabled={status === "loading" || status === "success"} type="submit">
        {status === "loading" ? "Enviando..." : status === "success" ? "Solicitud enviada" : "Enviar solicitud"}
      </Button>
      {status === "success" ? <p className="text-sm font-medium text-accent">Solicitud registrada. Un asesor tecnico la revisara.</p> : null}
      {status === "error" ? <p className="text-sm font-medium text-destructive">No pudimos registrar la solicitud. Intentalo nuevamente.</p> : null}
    </form>
  );
}
