import { handleApiError, ok, parseJson } from "@/lib/server/api";
import { requireBinvAdmin } from "@/lib/binv/admin-auth";
import { prisma } from "@/lib/prisma";
import { adminFinancingStatusSchema } from "@/lib/validations/binv";

const statusLabels: Record<string, string> = {
  RECEIVED: "Recibido",
  BINV_ANALYSIS: "En análisis BINV",
  DOCUMENTATION_REQUIRED: "Documentación requerida",
  SENT_TO_PARTNER: "Enviado a aliado",
  PARTNER_REVIEW: "En evaluación por aliado",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CLOSED: "Cerrado"
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = requireBinvAdmin(request);
  if (response) return response;

  try {
    const { id } = await context.params;
    const payload = await parseJson(request, adminFinancingStatusSchema);
    const row = await prisma.binvFinancingRequest.update({
      where: { id },
      data: { status: payload.status, notes: payload.notes }
    });

    return ok({
      id: row.id,
      status: row.status,
      statusLabel: statusLabels[row.status] ?? row.status
    });
  } catch (error) {
    return handleApiError(error);
  }
}
