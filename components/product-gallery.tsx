"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  brand: string;
  model?: string | null;
  badge?: string | null;
  requiresQuote?: boolean;
};

export function ProductGallery({ images, productName, brand, model, badge, requiresQuote }: ProductGalleryProps) {
  const galleryImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const activeImage = galleryImages[activeIndex];
  const hasMultipleImages = galleryImages.length > 1;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  }, [galleryImages.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  }, [galleryImages.length]);

  useEffect(() => {
    if (!isZoomOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsZoomOpen(false);
      if (event.key === "ArrowLeft" && hasMultipleImages) showPrevious();
      if (event.key === "ArrowRight" && hasMultipleImages) showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, isZoomOpen, galleryImages.length, showNext, showPrevious]);

  return (
    <div className="space-y-4">
      <div className="technical-grid rounded-lg border bg-muted p-4 md:p-6">
        <div className="overflow-hidden rounded-lg border bg-white shadow-technical">
          <div className="flex items-start justify-between gap-4 border-b bg-white/94 p-4">
            <div>
              <Badge>{badge || (requiresQuote ? "Cotizar" : "Disponible")}</Badge>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">{productName}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{brand}{model ? ` - ${model}` : ""}</p>
            </div>
            {activeImage ? (
              <Button type="button" variant="outline" size="icon" aria-label="Ampliar imagen" onClick={() => setIsZoomOpen(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>

          <div className="relative flex aspect-[16/11] items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.10),_transparent_58%)] p-5 md:p-8">
            {activeImage ? (
              <Image src={activeImage} alt={`${productName} imagen ${activeIndex + 1}`} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-contain p-5 md:p-8" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Imagen del producto pendiente
              </div>
            )}

            {hasMultipleImages ? (
              <>
                <Button type="button" variant="outline" size="icon" aria-label="Imagen anterior" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/92 shadow-sm" onClick={showPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" aria-label="Imagen siguiente" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/92 shadow-sm" onClick={showNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 right-4 rounded-full bg-slate-950/82 px-3 py-1 text-xs font-semibold text-white">
                  {activeIndex + 1} / {galleryImages.length}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {hasMultipleImages ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Ver imagen ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-md border bg-white p-1 transition ${activeIndex === index ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/60"}`}
            >
              <Image src={image} alt={`${productName} miniatura ${index + 1}`} fill sizes="96px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}

      {isZoomOpen && activeImage ? (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria ampliada de ${productName}`}
          onClick={() => setIsZoomOpen(false)}
        >
          <Button
            type="button"
            variant="outline"
            aria-label="Cerrar galeria"
            className="fixed right-4 top-4 z-[110] h-11 border-white/70 bg-white px-4 text-slate-950 shadow-lg hover:bg-white/90 md:right-6 md:top-6"
            onClick={(event) => {
              event.stopPropagation();
              setIsZoomOpen(false);
            }}
          >
            <X className="h-4 w-4" />
            Cerrar
          </Button>
          <div className="mx-auto flex h-full max-w-7xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 pb-4 text-white">
              <div>
                <p className="text-xs font-semibold uppercase text-white/62">{brand}{model ? ` - ${model}` : ""}</p>
                <p className="text-lg font-bold">{productName}</p>
              </div>
            </div>
            <div className="relative min-h-0 flex-1 rounded-lg bg-white">
              <Image src={activeImage} alt={`${productName} ampliado`} fill sizes="100vw" className="object-contain p-4 md:p-8" />
              {hasMultipleImages ? (
                <>
                  <Button type="button" variant="outline" size="icon" aria-label="Imagen anterior" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/94" onClick={showPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" aria-label="Imagen siguiente" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/94" onClick={showNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
