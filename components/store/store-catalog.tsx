"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";

type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

type StoreCatalogProps = {
  categories: StoreCategory[];
  products: ProductCardProduct[];
};

type AvailabilityFilter = "all" | "priced" | "quote" | "stock";
type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function StoreCatalog({ categories, products }: StoreCatalogProps) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [compare, setCompare] = useState<ProductCardProduct[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = normalizedQuery
        ? [product.name, product.brand, product.model, product.summary, product.category?.name].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery)
        : true;
      const matchesCategory = categorySlug === "all" || product.category?.slug === categorySlug;
      const matchesAvailability =
        availability === "all" ||
        (availability === "priced" && Boolean(product.price)) ||
        (availability === "quote" && (!product.price || product.requiresQuote)) ||
        (availability === "stock" && (product.stock ?? 0) > 0);
      return matchesQuery && matchesCategory && matchesAvailability;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [availability, categorySlug, products, query, sort]);

  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const canAddCompare = compare.length < 4;

  function toggleCompare(product: ProductCardProduct) {
    setCompare((current) => {
      if (current.some((item) => item.slug === product.slug)) {
        return current.filter((item) => item.slug !== product.slug);
      }
      if (current.length >= 4) return current;
      return [...current, product];
    });
  }

  function clearFilters() {
    setQuery("");
    setCategorySlug("all");
    setAvailability("all");
    setSort("featured");
  }

  return (
    <section className="container py-20">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Badge variant="outline">Catalogo activo</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Explora equipos por aplicacion, marca y disponibilidad</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            {filteredProducts.length} producto(s) visibles{selectedCategory ? ` en ${selectedCategory.name}` : ""}. Selecciona hasta 4 para comparar.
          </p>
        </div>
        <Button type="button" disabled={compare.length < 2} onClick={() => setIsCompareOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          Comparar equipos ({compare.length})
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-5 rounded-lg border bg-card p-5 shadow-technical lg:sticky lg:top-24 lg:self-start">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Busqueda</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Equipo, marca o modelo" className="pl-9" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Filter className="h-4 w-4" />
              Categorias
            </div>
            <div className="mt-3 space-y-1">
              <button type="button" onClick={() => setCategorySlug("all")} className={categoryButtonClass(categorySlug === "all")}>
                Todos <span className="text-xs text-muted-foreground">({products.length})</span>
              </button>
              {categories.map((category) => (
                <button key={category.id} type="button" onClick={() => setCategorySlug(category.slug)} className={categoryButtonClass(categorySlug === category.slug)}>
                  {category.name} <span className="text-xs text-muted-foreground">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Disponibilidad comercial</label>
            <div className="mt-3 grid gap-2">
              {[
                ["all", "Todos"],
                ["priced", "Con precio"],
                ["quote", "Bajo cotizacion"],
                ["stock", "Con stock"]
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setAvailability(value as AvailabilityFilter)} className={categoryButtonClass(availability === value)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Ordenar</label>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm">
              <option value="featured">Recientes / destacados</option>
              <option value="price-asc">Precio menor a mayor</option>
              <option value="price-desc">Precio mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>Limpiar filtros</Button>
        </aside>

        <div className="space-y-5">
          {compare.length ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
              <span className="text-sm font-semibold">Comparando:</span>
              {compare.map((product) => (
                <button key={product.slug} type="button" onClick={() => toggleCompare(product)} className="rounded-full border bg-muted px-3 py-1 text-xs font-semibold hover:border-primary">
                  {product.name} <X className="ml-1 inline h-3 w-3" />
                </button>
              ))}
            </div>
          ) : null}

          {filteredProducts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  compareSelected={compare.some((item) => item.slug === product.slug)}
                  compareDisabled={!canAddCompare}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <p className="font-semibold">No encontramos productos con esos filtros.</p>
                <p className="mt-2 text-sm text-muted-foreground">Prueba otra categoria, limpia la busqueda o solicita una cotizacion consultiva.</p>
                <Button type="button" className="mt-5" onClick={clearFilters}>Ver todo el catalogo</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {isCompareOpen ? (
        <div className="fixed inset-0 z-[90] bg-slate-950/80 p-4" role="dialog" aria-modal="true" onClick={() => setIsCompareOpen(false)}>
          <div className="mx-auto max-h-full max-w-6xl overflow-auto rounded-xl bg-background shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-5">
              <div>
                <p className="text-sm font-semibold uppercase text-primary">Comparador tecnico</p>
                <h3 className="font-display text-2xl font-bold">Equipos seleccionados</h3>
              </div>
              <Button type="button" variant="outline" size="icon" aria-label="Cerrar comparador" onClick={() => setIsCompareOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `180px repeat(${compare.length}, minmax(180px, 1fr))` }}>
              <CompareLabel label="Equipo" />
              {compare.map((product) => <CompareProductHeader key={product.slug} product={product} />)}
              <CompareLabel label="Marca / modelo" />
              {compare.map((product) => <CompareValue key={product.slug} value={`${product.brand}${product.model ? ` - ${product.model}` : ""}`} />)}
              <CompareLabel label="Categoria" />
              {compare.map((product) => <CompareValue key={product.slug} value={product.category?.name || "-"} />)}
              <CompareLabel label="Precio" />
              {compare.map((product) => <CompareValue key={product.slug} value={product.price ? formatCurrency(product.price, product.currency) : "Cotizar"} strong />)}
              <CompareLabel label="Disponibilidad" />
              {compare.map((product) => <CompareValue key={product.slug} value={(product.stock ?? 0) > 0 ? `${product.stock} disponible(s)` : product.availability} />)}
              <CompareLabel label="Resumen" />
              {compare.map((product) => <CompareValue key={product.slug} value={product.summary} />)}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function categoryButtonClass(active: boolean) {
  return cn(
    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
    active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
  );
}

function CompareLabel({ label }: { label: string }) {
  return <div className="border-b border-r bg-muted/45 p-4 text-sm font-bold">{label}</div>;
}

function CompareValue({ value, strong = false }: { value: string; strong?: boolean }) {
  return <div className={cn("border-b border-r p-4 text-sm leading-6", strong && "text-lg font-bold")}>{value}</div>;
}

function CompareProductHeader({ product }: { product: ProductCardProduct }) {
  const image = product.images?.[0];
  return (
    <div className="border-b border-r p-4">
      <div className="relative aspect-[4/3] rounded-md border bg-white">
        {image ? <Image src={image} alt={product.name} fill sizes="180px" className="object-contain p-3" /> : null}
      </div>
      <p className="mt-3 font-semibold leading-tight">{product.name}</p>
    </div>
  );
}
