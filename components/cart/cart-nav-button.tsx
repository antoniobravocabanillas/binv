"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCartCount } from "@/lib/cart";
import { readCart } from "@/components/cart/cart-store";

export function CartNavButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getCartCount(readCart()));
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("icc-cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("icc-cart-updated", updateCount);
    };
  }, []);

  return (
    <Button asChild variant="ghost" size="icon" aria-label={count ? `Carrito con ${count} producto(s)` : "Carrito"}>
      <Link href="/checkout" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
