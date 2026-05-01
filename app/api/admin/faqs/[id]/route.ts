import { prisma } from "@/lib/prisma";
import { handleApiError, ok, parseJson } from "@/lib/server/api";
import { requireRole } from "@/lib/server/authz";
import { idSchema } from "@/lib/validations/common";
import { faqUpdateSchema } from "@/lib/validations/content";

type FaqAdminRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: FaqAdminRouteProps) {
  const { response } = await requireRole("EDITOR");
  if (response) return response;

  try {
    const { id } = idSchema.parse(await params);
    const payload = await parseJson(request, faqUpdateSchema);
    const faq = await prisma.faq.update({ where: { id }, data: payload });
    return ok(faq);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: FaqAdminRouteProps) {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  try {
    const { id } = idSchema.parse(await params);
    await prisma.faq.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
