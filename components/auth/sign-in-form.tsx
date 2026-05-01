"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const response = await signIn("credentials", {
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        redirect: false
      });

      if (response?.error) {
        setError("Credenciales invalidas. Revisa el correo y la contrasena.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg border bg-card p-6 shadow-technical">
      <div>
        <label className="text-sm font-semibold" htmlFor="email">Correo</label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@icctopografia.pe" className="mt-2" />
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="password">Contrasena</label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="********" className="mt-2" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Ingresando..." : "Ingresar al panel"}
      </Button>
      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
    </form>
  );
}
