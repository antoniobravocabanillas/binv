import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { brand } from "@/lib/brand";

const adminNav = [
  { label: "Dashboard", href: "/admin", roles: ["TECHNICIAN", "SALES", "EDITOR", "ADMIN"] },
  { label: "Productos", href: "/admin/productos", roles: ["EDITOR", "ADMIN"] },
  { label: "Pedidos", href: "/admin/pedidos", roles: ["SALES", "ADMIN"] },
  { label: "Contenidos", href: "/admin/contenidos", roles: ["EDITOR", "ADMIN"] },
  { label: "Chat", href: "/admin/chat", roles: ["TECHNICIAN", "SALES", "EDITOR", "ADMIN"] },
  { label: "Equipo", href: "/admin/equipo", roles: ["ADMIN"] },
  { label: "Leads", href: "/admin/leads", roles: ["SALES", "ADMIN"] }
];

const allowedRoles = new Set(["TECHNICIAN", "SALES", "EDITOR", "ADMIN"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/cuenta?callbackUrl=/admin");
  if (!allowedRoles.has(session.user.role || "")) redirect("/");
  const navItems = adminNav.filter((item) => item.roles.includes(session.user.role || ""));

  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-[#063D63] p-5 text-white lg:block">
        <div className="font-bold">{brand.shortName} Admin</div>
        <p className="mt-2 text-xs text-white/60">{session.user.email}</p>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm text-white/72 hover:bg-white/10 hover:text-white">{item.label}</Link>)}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <SignOutButton className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  );
}
