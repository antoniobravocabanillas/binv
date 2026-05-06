import { handleApiError, ok } from "@/lib/server/api";
import { filterOpportunities } from "@/lib/binv/domain";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") ?? undefined;
    const assetType = searchParams.get("assetType") ?? undefined;
    const data = filterOpportunities(country as never, assetType);
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}

