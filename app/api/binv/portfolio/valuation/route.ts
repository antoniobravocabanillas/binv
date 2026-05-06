import { valuePortfolio } from "@/lib/binv/market-data";
import { handleApiError, ok, parseJson } from "@/lib/server/api";
import { portfolioValuationSchema } from "@/lib/validations/binv";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, portfolioValuationSchema);
    const valuation = await valuePortfolio(payload.positions, payload.baseCurrency);
    return ok(valuation);
  } catch (error) {
    return handleApiError(error);
  }
}

