"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

export type ProductCardProduct = {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  model?: string | null;
  summary: string;
  availability: string;
  price?: number | null;
  currency?: string;
  badge?: string | null;
  requiresQuote?: boolean;
  stock?: number;
  images?: string[];
  category?: {
    name: string;
    slug?: string;
  };
};

type ProductCardProps = {
  product: ProductCardProduct;
  compareSelected?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: (product: ProductCardProduct) => void;
};

export function ProductCard({ product, compareSelected = false, compareDisabled = false, onToggleCompare }: ProductCardProps) {
  const stock = product.stock ?? 0;
  const coverImage = product.images?.[0];

  return (
    <Card className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-primary/60 motion-reduce:transform-none">
      <div className="technical-grid bg-muted p-3">
        <div className="relative flex min-h-[280px] flex-col overflow-hidden rounded-md border bg-white/94">
          {coverImage ? (
            <Link href={`/tienda/${product.slug}`} className="relative min-h-0 flex-1 bg-white">
              <Image
                src={coverImage}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 100vw"
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.05]"
              />
            </Link>
          ) : (
            <Link href={`/tienda/${product.slug}`} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#061827] text-white">
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(36,200,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(36,200,238,0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
              <div className="relative px-6 text-center">
                <p className="text-xs font-semibold uppercase text-[#7DE4FF]">{product.brand}</p>
                <p className="mt-3 font-display text-2xl font-bold leading-tight">{product.model || product.name}</p>
                <p className="mt-2 text-xs text-white/60">Imagen pendiente de catalogo</p>
              </div>
            </Link>
          )}
          <div className="flex items-end justify-between gap-3 border-t bg-white/96 p-3">
            <div className="min-w-0">
              <Badge variant={product.badge === "Oferta" ? "secondary" : "default"}>{product.badge || (product.requiresQuote ? "Cotizar" : "Disponible")}</Badge>
              <p className="mt-2 text-xs font-semibold uppercase text-muted-foreground">{product.brand}</p>
              <Link href={`/tienda/${product.slug}`} className="mt-1 line-clamp-2 block text-base font-bold leading-5 hover:text-primary">{product.name}</Link>
            </div>
            <Button variant="outline" size="icon" aria-label="Agregar a favoritos" className="shrink-0">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="space-y-4 pt-5">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{product.summary}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Disponibilidad</p>
            <p className="text-sm font-semibold">{stock > 0 ? `${stock} disponible(s)` : product.availability}</p>
          </div>
          <p className="text-lg font-bold">{product.price ? formatCurrency(product.price, product.currency) : "Cotizar"}</p>
        </div>
        {onToggleCompare ? (
          <Button
            type="button"
            variant={compareSelected ? "secondary" : "outline"}
            className={cn("w-full", compareSelected && "border-primary")}
            disabled={!compareSelected && compareDisabled}
            onClick={() => onToggleCompare(product)}
          >
            <Scale className="h-4 w-4" />
            {compareSelected ? "Quitar de comparacion" : "Comparar equipo"}
          </Button>
        ) : null}
        <Button asChild className="w-full">
          <Link href={`/tienda/${product.slug}`}>
            Ver ficha <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
