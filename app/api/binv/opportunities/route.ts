import { handleApiError, ok } from "@/lib/server/api";
import type { BinvCountry } from "@/lib/binv/domain";
import { fallbackOpportunities, findOpportunities } from "@/lib/binv/repository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get("country") ?? undefined) as BinvCountry | undefined;
    const assetType = searchParams.get("assetType") ?? undefined;
    const dbData = await findOpportunities(country, assetType);
    const data = dbData.length > 0 ? dbData : fallbackOpportunities(country, assetType);
    return ok(data);
  } catch (error) {
    try {
      const { searchParams } = new URL(request.url);
      const country = (searchParams.get("country") ?? undefined) as BinvCountry | undefined;
      const assetType = searchParams.get("assetType") ?? undefined;
      return ok(fallbackOpportunities(country, assetType));
    } catch {
      return handleApiError(error);
    }
  }
}
