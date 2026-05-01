import { prisma } from "@/lib/prisma";
import { handleApiError, ok } from "@/lib/server/api";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { active: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }]
    });
    return ok(faqs);
  } catch (error) {
    return handleApiError(error);
  }
}
