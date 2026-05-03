import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError, parseJson } from "@/lib/server/api";
import { registerSchema } from "@/lib/validations/crm";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, registerSchema);
    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existingUser) {
      return fail("Ya existe una cuenta con este correo.", 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          passwordHash,
          role: "CUSTOMER"
        },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });

      const company = await tx.company.create({
        data: {
          legalName: payload.company,
          tradeName: payload.company,
          document: payload.document,
          email: payload.email,
          phone: payload.phone,
          status: "pendiente_aprobacion",
          contacts: {
            create: {
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              isPrimary: true
            }
          }
        },
        include: { contacts: true }
      });

      const client = await tx.client.create({
        data: {
          userId: createdUser.id,
          companyId: company.id,
          name: payload.name,
          company: payload.company,
          document: payload.document,
          email: payload.email,
          phone: payload.phone,
          contactName: payload.name,
          status: "pendiente_aprobacion"
        }
      });

      await tx.clientAccount.create({
        data: {
          userId: createdUser.id,
          companyId: company.id,
          contactId: company.contacts[0]?.id,
          clientId: client.id,
          status: "pending_approval",
          invitedAt: new Date()
        }
      });

      await tx.notification.create({
        data: {
          type: "SYSTEM",
          title: "Nuevo registro de cliente pendiente",
          body: `${payload.name} solicito acceso al portal para ${payload.company}.`,
          href: "/admin/clientes"
        }
      });

      return createdUser;
    });

    return created({ ...user, status: "pending_approval" });
  } catch (error) {
    return handleApiError(error);
  }
}
