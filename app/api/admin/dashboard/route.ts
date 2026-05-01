import { prisma } from "@/lib/prisma";
import { handleApiError, ok } from "@/lib/server/api";
import { requireRole } from "@/lib/server/authz";

export async function GET() {
  const { response } = await requireRole("SALES");
  if (response) return response;

  try {
    const [
      productCount,
      pendingOrders,
      newLeads,
      unreadMessages,
      recentLeads,
      recentOrders
    ] = await prisma.$transaction([
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count(),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
    ]);

    return ok({
      counters: {
        productCount,
        pendingOrders,
        newLeads,
        unreadMessages
      },
      recentLeads,
      recentOrders: recentOrders.map((order) => ({ ...order, total: Number(order.total) }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}
