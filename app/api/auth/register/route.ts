import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { created, handleApiError, parseJson } from "@/lib/server/api";
import { registerSchema } from "@/lib/validations/crm";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, registerSchema);
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash,
        role: "CUSTOMER"
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return created(user);
  } catch (error) {
    return handleApiError(error);
  }
}
