import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type ProductCardProduct = {
  slug: string;
  name: string;
  brand: string;
  summary: string;
  availability: string;
  price?: number | null;
  badge?: string | null;
  requiresQuote?: boolean;
  stock?: number;
  images?: string[];
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const stock = product.stock ?? 0;
  const coverImage = product.images?.[0];

  return (
    <Card className="overflow-hidden">
      <div className="technical-grid aspect-[4/3] bg-muted p-4">
        <div className="relative flex h-full flex-col overflow-hidden rounded-md border bg-white/90">
          {coverImage ? (
            <div className="relative min-h-0 flex-1 bg-white">
              <Image src={coverImage} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]" />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center bg-muted text-xs text-muted-foreground">Imagen pendiente</div>
          )}
          <div className="flex items-end justify-between gap-3 border-t bg-white/96 p-3">
            <div className="min-w-0">
              <Badge variant={product.badge === "Oferta" ? "secondary" : "default"}>{product.badge || (product.requiresQuote ? "Cotizar" : "Disponible")}</Badge>
              <p className="mt-2 text-xs font-semibold uppercase text-muted-foreground">{product.brand}</p>
              <h3 className="mt-1 line-clamp-2 text-base font-bold leading-5">{product.name}</h3>
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
          <p className="text-lg font-bold">{product.price ? formatCurrency(product.price) : "Cotizar"}</p>
        </div>
        <Button asChild className="w-full">
          <Link href={`/tienda/${product.slug}`}>
            Ver ficha <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
