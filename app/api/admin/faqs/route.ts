import { prisma } from "@/lib/prisma";
import { created, handleApiError, ok, parseJson } from "@/lib/server/api";
import { requireRole } from "@/lib/server/authz";
import { faqInputSchema } from "@/lib/validations/content";

export async function GET() {
  const { response } = await requireRole("EDITOR");
  if (response) return response;

  try {
    const faqs = await prisma.faq.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });
    return ok(faqs);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole("EDITOR");
  if (response) return response;

  try {
    const payload = await parseJson(request, faqInputSchema);
    const faq = await prisma.faq.create({ data: payload });
    return created(faq);
  } catch (error) {
    return handleApiError(error);
  }
}
