import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t bg-[#063D63] text-white">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo className="h-20 w-72 max-w-full" />
          <div className="mt-4 text-xl font-bold">{brand.name}</div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">
            Ingenieria, construccion y consultoria para soluciones de topografia, geodesia, instrumentacion, alquiler, mantenimiento y soporte tecnico especializado.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Comercial</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/72">
            <li><Link href="/tienda">Tienda tecnica</Link></li>
            <li><Link href="/cotizacion">Solicitar cotizacion</Link></li>
            <li><Link href="/servicios">Servicios</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/72">
            <li><Link href="/privacidad">Privacidad</Link></li>
            <li><Link href="/terminos">Terminos</Link></li>
            <li><a href={brand.manual}>Manual de marca</a></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
