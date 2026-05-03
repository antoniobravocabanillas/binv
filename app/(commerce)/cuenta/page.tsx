import Link from "next/link";
import { ArrowRight, BadgeCheck, LayoutDashboard, LockKeyhole, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { ClientRegistrationForm } from "@/components/auth/client-registration-form";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Cuenta de usuario", description: "Acceso de usuarios, pedidos, favoritos y cotizaciones.", path: "/cuenta" });

export default async function AccountPage() {
  const session = await auth();

  return (
    <section className="relative isolate overflow-hidden bg-[#03111D] text-white">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(36,200,238,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(36,200,238,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#24C8EE]/70 to-transparent" />

      <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="max-w-3xl">
          <Badge className="bg-white text-[#063D63] hover:bg-white">Cuenta ICC</Badge>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
            Acceso operativo para ventas, soporte y administracion tecnica.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            Desde este punto el equipo ICC gestiona cotizaciones, leads, pedidos, productos, contenidos y conversaciones en linea con trazabilidad comercial.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: MessageCircle, title: "Chat", text: "atencion asignada" },
              { icon: LayoutDashboard, title: "Panel", text: "operacion B2B" },
              { icon: ShieldCheck, title: "Roles", text: "permisos internos" }
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/14 bg-white/[0.055] p-4 backdrop-blur">
                <item.icon className="h-5 w-5 text-[#24C8EE]" />
                <p className="mt-4 font-display text-xl font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/68">
            <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#24C8EE]" /> Acceso para equipo autorizado</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#24C8EE]" /> Autenticacion con credenciales</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-2">
          {session?.user ? (
            <>
              <Card className="overflow-hidden border-white/14 bg-white text-foreground shadow-2xl">
                <CardHeader className="border-b bg-[#f7fbfd]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <CardTitle>Sesion activa</CardTitle>
                  <CardDescription>{session.user.name || session.user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="rounded-md border bg-muted/40 p-4">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Rol asignado</p>
                    <p className="mt-1 font-display text-2xl font-bold">{session.user.role}</p>
                  </div>
                  <div className="grid gap-3">
                    <Button asChild size="lg">
                      <Link href={session.user.role === "CUSTOMER" ? "/portal" : "/admin"}>
                        {session.user.role === "CUSTOMER" ? "Ir al portal" : "Ir al panel"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <SignOutButton className="h-11 w-full justify-center border-destructive/30 text-destructive hover:bg-destructive/10" />
                  </div>
                </CardContent>
              </Card>
              <div id="registro-cliente" className="scroll-mt-24">
                <ClientRegistrationForm />
              </div>
            </>
          ) : (
            <>
              <SignInForm />
              <div id="registro-cliente" className="scroll-mt-24">
                <ClientRegistrationForm />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
