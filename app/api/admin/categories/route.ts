import { prisma } from "@/lib/prisma";
import { created, handleApiError, ok, parseJson, slugify } from "@/lib/server/api";
import { requireRole } from "@/lib/server/authz";
import { categoryInputSchema } from "@/lib/validations/product";

export async function GET() {
  const { response } = await requireRole("SALES");
  if (response) return response;

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

export async function POST(request: Request) {
  const { response } = await requireRole("EDITOR");
  if (response) return response;

  try {
    const payload = await parseJson(request, categoryInputSchema);
    const category = await prisma.category.create({
      data: { ...payload, slug: payload.slug ?? slugify(payload.name) }
    });
    return created(category);
  } catch (error) {
    return handleApiError(error);
  }
}
