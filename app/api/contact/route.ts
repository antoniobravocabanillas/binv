import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
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
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const contact = await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: contact.id });
}
