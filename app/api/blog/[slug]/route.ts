import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/server/api";
import { slugParamSchema } from "@/lib/validations/common";

type BlogRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: BlogRouteProps) {
  try {
    const { slug } = slugParamSchema.parse(await params);
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post?.publishedAt) return fail("Post no encontrado", 404);
    return ok(post);
  } catch (error) {
    return handleApiError(error);
  }
}
