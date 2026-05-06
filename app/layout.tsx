import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${brand.name} | ${brand.descriptor}`,
    template: `%s | ${brand.shortName}`
  },
  description: "Plataforma institucional de asesoramiento, originacion y estructuracion financiera para clientes e instituciones en Argentina y Peru."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
