"use client";

import Link from "next/link";
import { LayoutDashboard, Menu, PhoneCall, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { CartNavButton } from "@/components/cart/cart-nav-button";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

const navItems = [
  ["Nosotros", "/nosotros"],
  ["Servicios", "/servicios"],
  ["Proyectos", "/proyectos"],
  ["Sectores", "/sectores"],
  ["Tienda", "/tienda"],
  ["Blog", "/blog"],
  ["Contacto", "/contacto"]
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/94 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold" aria-label={`${brand.name} inicio`}>
          <BrandLogo variant="mark" className="h-11 w-11" priority />
          <span className="leading-tight">
            <span className="font-display">{brand.shortName}</span>
            <span className="block text-xs font-medium text-muted-foreground">{brand.tagline}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CartNavButton />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/cotizacion">
              <PhoneCall className="h-4 w-4" />
              Cotizar
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="site-navigation-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 top-16 z-40 bg-slate-950/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <nav
            id="site-navigation-menu"
            aria-label="Menu principal"
            className="ml-auto mr-4 mt-3 w-[calc(100vw-2rem)] max-w-[420px] overflow-hidden rounded-lg border bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b bg-[#03111D] px-5 py-4 text-white">
              <p className="text-sm font-semibold uppercase text-[#7DE4FF]">ICC Topografia</p>
              <p className="mt-1 text-sm text-white/70">Accesos comerciales, cuenta y panel operativo.</p>
            </div>
            <div className="grid p-3">
              {navItems.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="grid gap-2 border-t p-4">
              <Button asChild>
                <Link href="/cuenta">
                  <UserRound className="h-4 w-4" />
                  Cuenta / login
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  Panel admin
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/cotizacion">
                  <PhoneCall className="h-4 w-4" />
                  Solicitar cotizacion
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
