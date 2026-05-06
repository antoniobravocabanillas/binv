import { created, handleApiError, ok, parseJson } from "@/lib/server/api";
import { requireBinvAdmin } from "@/lib/binv/admin-auth";
import type { BinvCountry } from "@/lib/binv/domain";
import { adminOpportunitySchema } from "@/lib/validations/binv";
import { createOpportunity, fallbackOpportunities, findOpportunities } from "@/lib/binv/repository";

export async function GET(request: Request) {
  const { response } = requireBinvAdmin(request);
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get("country") ?? undefined) as BinvCountry | undefined;
    const assetType = searchParams.get("assetType") ?? undefined;
    const dbData = await findOpportunities(country, assetType);
    return ok({
      source: dbData.length > 0 ? "database" : "fallback",
      items: dbData.length > 0 ? dbData : fallbackOpportunities(country, assetType)
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const { response } = requireBinvAdmin(request);
  if (response) return response;

  try {
    const payload = await parseJson(request, adminOpportunitySchema);
    const data = await createOpportunity(payload);
    return created(data);
  } catch (error) {
    return handleApiError(error);
  }
}
