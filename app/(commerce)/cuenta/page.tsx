import Link from "next/link";
import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Cuenta de usuario", description: "Acceso de usuarios, pedidos, favoritos y cotizaciones.", path: "/cuenta" });

export default async function AccountPage() {
  const session = await auth();

  return (
    <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_420px]">
      <div>
        <h1 className="font-display text-4xl font-bold">Cuenta de usuario</h1>
        <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
          Acceso para administradores y equipo comercial. Desde aqui se ingresa al panel para revisar cotizaciones, leads, pedidos y contenido.
        </p>
        {session?.user ? (
          <Card className="mt-8 max-w-xl">
            <CardHeader>
              <CardTitle>Sesion activa</CardTitle>
              <CardDescription>{session.user.name || session.user.email} - Rol {session.user.role}</CardDescription>
              <div className="flex gap-3 pt-3">
                <Button asChild><Link href="/admin">Ir al panel</Link></Button>
                <SignOutButton />
              </div>
            </CardHeader>
          </Card>
        ) : null}
      </div>
      {session?.user ? null : <SignInForm />}
    </section>
  );
}
