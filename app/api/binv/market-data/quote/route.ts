import { manualMarketDataProvider } from "@/lib/binv/market-data";
import { fail, handleApiError, ok } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const market = searchParams.get("market") ?? "GLOBAL";

    if (!symbol) return fail("symbol es requerido", 422);

    const quote = await manualMarketDataProvider.getQuote(symbol, market);
    return ok(quote);
  } catch (error) {
    return handleApiError(error);
  }
}

