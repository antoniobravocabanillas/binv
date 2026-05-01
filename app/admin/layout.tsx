import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { brand } from "@/lib/brand";

const adminNav = [
  ["Dashboard", "/admin"],
  ["Productos", "/admin/productos"],
  ["Pedidos", "/admin/pedidos"],
  ["Contenidos", "/admin/contenidos"],
  ["Leads", "/admin/leads"]
];

const allowedRoles = new Set(["SALES", "EDITOR", "ADMIN"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/cuenta?callbackUrl=/admin");
  if (!allowedRoles.has(session.user.role || "")) redirect("/");

  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-[#063D63] p-5 text-white lg:block">
        <div className="font-bold">{brand.shortName} Admin</div>
        <p className="mt-2 text-xs text-white/60">{session.user.email}</p>
        <nav className="mt-8 space-y-2">
          {adminNav.map(([label, href]) => <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-white/72 hover:bg-white/10 hover:text-white">{label}</Link>)}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <SignOutButton />
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  );
}
