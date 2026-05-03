"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ClientRegistrationForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
          company: String(formData.get("company") || ""),
          document: String(formData.get("document") || ""),
          phone: String(formData.get("phone") || "")
        })
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || "No se pudo registrar la solicitud.");
        return;
      }

      setMessage("Solicitud enviada. ICC validara tus datos antes de activar el portal.");
    });
  }

  return (
    <form action={submit} className="relative overflow-hidden rounded-lg border bg-card p-6 text-foreground shadow-2xl md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Portal cliente</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Solicitar acceso</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">El acceso queda pendiente hasta que el equipo ICC valide la empresa y el contacto.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Input name="name" required placeholder="Nombre y apellido" autoComplete="name" />
        <Input name="company" required placeholder="Empresa / razon social" autoComplete="organization" />
        <Input name="document" placeholder="RUC / documento" />
        <Input name="phone" placeholder="Telefono / WhatsApp" autoComplete="tel" />
        <Input name="email" type="email" required placeholder="Correo corporativo" autoComplete="email" />
        <Input name="password" type="password" required minLength={8} placeholder="Contrasena temporal" autoComplete="new-password" />
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? "Enviando solicitud..." : "Solicitar acceso"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {message ? <p className="flex items-center gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {message}</p> : null}
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      </div>
    </form>
  );
}
