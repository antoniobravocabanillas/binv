import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, paginated } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip, take } = getPagination(searchParams);
    const category = searchParams.get("category")?.trim();
    const where = {
      publishedAt: { not: null },
      ...(category ? { category } : {})
    };

    const [posts, total] = await prisma.$transaction([
      prisma.blogPost.findMany({ where, orderBy: { publishedAt: "desc" }, skip, take }),
      prisma.blogPost.count({ where })
    ]);

    return paginated(posts, { page, pageSize, total, pageCount: Math.ceil(total / pageSize) });
  } catch (error) {
    return handleApiError(error);
  }
}
