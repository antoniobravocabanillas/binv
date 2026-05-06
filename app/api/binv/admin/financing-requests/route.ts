import { handleApiError, ok } from "@/lib/server/api";
import { requireBinvAdmin } from "@/lib/binv/admin-auth";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: Request) {
  const { response } = requireBinvAdmin(request);
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") as "PE" | "AR" | null;
    const rows = await prisma.binvFinancingRequest.findMany({
      where: country ? { countryCode: country } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return ok(rows.map((item) => ({
      id: item.id,
      country: item.countryCode,
      legalName: item.legalName,
      taxId: item.taxId,
      sector: item.sector,
      amountRequested: Number(item.amountRequested),
      currency: item.currency,
      instrument: item.possibleInstrument ?? "Pendiente",
      status: item.status,
      statusLabel: statusLabels[item.status] ?? item.status,
      contactName: item.contactName,
      contactEmail: item.contactEmail,
      createdAt: item.createdAt.toISOString()
    })));
  } catch (error) {
    return handleApiError(error);
  }
}
