import { canAccessDataRoom } from "@/lib/binv/domain";
import { fallbackOpportunities, findOpportunities } from "@/lib/binv/repository";
import { fail, handleApiError, ok, parseJson } from "@/lib/server/api";
import { dataRoomAccessSchema } from "@/lib/validations/binv";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, dataRoomAccessSchema);
    const opportunities = await findOpportunities(payload.user.country).catch(() => fallbackOpportunities(payload.user.country));
    const opportunity = opportunities.find((item) => item.id === payload.opportunityId)
      ?? fallbackOpportunities(payload.user.country).find((item) => item.id === payload.opportunityId);

    if (!opportunity) return fail("Oportunidad no encontrada", 404);

    const allowed = canAccessDataRoom(payload.user, opportunity);
    return ok({
      allowed,
      opportunityId: opportunity.id,
      userId: payload.user.id,
      reason: allowed ? "Acceso habilitado" : "Requiere KYC aprobado y/o perfil calificado",
      required: {
        kyc: opportunity.requiresKyc,
        qualifiedProfile: opportunity.requiresQualifiedProfile
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
