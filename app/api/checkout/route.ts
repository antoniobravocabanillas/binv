import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1)
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const order = await prisma.order.create({
    data: {
      customerEmail: parsed.data.email,
      customerName: parsed.data.name,
      customerPhone: parsed.data.phone,
      status: "PENDING",
      total: 0,
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: 0,
          subtotal: 0
        }))
      }
    }
  });

  return NextResponse.json({ ok: true, id: order.id });
}
