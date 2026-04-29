import Link from "next/link";
import { brand } from "@/lib/brand";

const adminNav = [
  ["Dashboard", "/admin"],
  ["Productos", "/admin/productos"],
  ["Pedidos", "/admin/pedidos"],
  ["Contenidos", "/admin/contenidos"],
  ["Leads", "/admin/leads"]
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-[#063D63] p-5 text-white lg:block">
        <div className="font-bold">{brand.shortName} Admin</div>
        <nav className="mt-8 space-y-2">
          {adminNav.map(([label, href]) => <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-white/72 hover:bg-white/10 hover:text-white">{label}</Link>)}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  );
}
