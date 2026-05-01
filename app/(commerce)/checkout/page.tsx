import { CheckoutClient } from "@/components/cart/checkout-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Checkout",
  description: "Checkout consultivo para pedidos B2B de equipos topograficos e instrumentacion tecnica.",
  path: "/checkout"
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
