import { prisma } from "@/lib/prisma";
import { handleApiError, ok } from "@/lib/server/api";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" }
    });
    return ok(services);
  } catch (error) {
    return handleApiError(error);
  }
}
