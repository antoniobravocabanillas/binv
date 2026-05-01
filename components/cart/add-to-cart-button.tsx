"use client";

import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/lib/cart";
import { addCartItem } from "@/components/cart/cart-store";

type AddToCartButtonProps = {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
  disabledLabel?: string;
};

export function AddToCartButton({ item, disabled, disabledLabel = "No disponible para compra directa" }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addCartItem({ ...item, quantity: 1 });
    setAdded(true);
  }

  if (added) {
    return (
      <Button asChild className="w-full">
        <Link href="/checkout">
          <Check className="h-4 w-4" />
          Ver carrito
        </Link>
      </Button>
    );
  }

  return (
    <Button type="button" className="w-full" disabled={disabled} onClick={handleAdd}>
      <ShoppingCart className="h-4 w-4" />
      {disabled ? disabledLabel : "Agregar al carrito"}
    </Button>
  );
}
