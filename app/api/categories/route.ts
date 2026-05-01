import { prisma } from "@/lib/prisma";
import { handleApiError, ok } from "@/lib/server/api";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" }
    });
    return ok(categories);
  } catch (error) {
    return handleApiError(error);
  }
}
