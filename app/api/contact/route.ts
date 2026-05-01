import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError } from "@/lib/server/api";
import { contactSchema } from "@/lib/validations/crm";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = contactSchema.parse(Object.fromEntries(formData));

    const contact = await prisma.contactMessage.create({ data: parsed });
    return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export function GET() {
  return fail("Metodo no permitido", 405);
}
