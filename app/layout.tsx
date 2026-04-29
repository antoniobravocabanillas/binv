import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${brand.name} | ${brand.descriptor}`,
    template: `%s | ${brand.shortName}`
  },
  description: "Soluciones profesionales en topografia, geodesia, ingenieria, construccion, consultoria, venta tecnica, alquiler y soporte especializado."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
