import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { created, handleApiError, ok, parseJson, slugify } from "@/lib/server/api";
import { requireRole } from "@/lib/server/authz";
import { serviceInputSchema } from "@/lib/validations/content";

export async function GET() {
  const { response } = await requireRole("EDITOR");
  if (response) return response;

  try {
    const services = await prisma.service.findMany({ orderBy: { updatedAt: "desc" } });
    return ok(services);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole("EDITOR");
  if (response) return response;

  try {
    const payload = await parseJson(request, serviceInputSchema);
    const service = await prisma.service.create({
      data: { ...payload, slug: payload.slug ?? slugify(payload.title), content: payload.content as Prisma.InputJsonValue }
    });
    return created(service);
  } catch (error) {
    return handleApiError(error);
  }
}
