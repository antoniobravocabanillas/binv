import Link from "next/link";
import { Menu, PhoneCall } from "lucide-react";
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
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
