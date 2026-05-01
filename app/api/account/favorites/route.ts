import { prisma } from "@/lib/prisma";
import { created, handleApiError, ok, parseJson } from "@/lib/server/api";
import { requireUser } from "@/lib/server/authz";
import { favoriteInputSchema } from "@/lib/validations/commerce";

export async function GET() {
  const { response, session } = await requireUser();
  if (response) return response;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { category: true, variants: true } } },
      orderBy: { id: "desc" }
    });

    return ok(favorites);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const { response, session } = await requireUser();
  if (response) return response;

  try {
    const payload = await parseJson(request, favoriteInputSchema);
    const favorite = await prisma.favorite.upsert({
      where: { userId_productId: { userId: session.user.id, productId: payload.productId } },
      update: {},
      create: { userId: session.user.id, productId: payload.productId }
    });

    return created(favorite);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  const { response, session } = await requireUser();
  if (response) return response;

  try {
    const payload = await parseJson(request, favoriteInputSchema);
    await prisma.favorite.delete({
      where: { userId_productId: { userId: session.user.id, productId: payload.productId } }
    });

    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
