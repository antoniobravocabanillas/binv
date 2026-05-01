"use client";

import { CART_STORAGE_KEY, CartItem, normalizeCartItem } from "@/lib/cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizeCartItem(item as CartItem)).filter((item) => item.productId && item.price);
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.map(normalizeCartItem)));
  window.dispatchEvent(new Event("icc-cart-updated"));
}

export function addCartItem(item: CartItem) {
  const current = readCart();
  const existing = current.find((cartItem) => cartItem.productId === item.productId);
  const next = existing
    ? current.map((cartItem) =>
        cartItem.productId === item.productId
          ? normalizeCartItem({ ...cartItem, quantity: cartItem.quantity + item.quantity })
          : cartItem
      )
    : [...current, normalizeCartItem(item)];

  writeCart(next);
  return next;
}
