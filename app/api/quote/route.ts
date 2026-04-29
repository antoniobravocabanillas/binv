import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const quoteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10),
  intent: z.string().optional(),
  context: z.string().optional()
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      message: parsed.data.message,
      source: parsed.data.context ?? parsed.data.intent ?? "web"
    }
  });

  return NextResponse.json({ ok: true, id: lead.id });
}
