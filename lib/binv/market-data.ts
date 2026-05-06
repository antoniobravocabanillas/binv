import type { BinvCurrency, MarketQuote, PortfolioInputPosition, PortfolioValuation } from "@/lib/binv/domain";

const demoPrices: Record<string, { price: number; previousClose: number; currency: BinvCurrency }> = {
  "AL30.BA": { price: 63.45, previousClose: 62.8, currency: "USD" },
  "GD30.BA": { price: 66.2, previousClose: 65.7, currency: "USD" },
  "YPFD.BA": { price: 38600, previousClose: 37950, currency: "ARS" },
  "BAP.LM": { price: 158.4, previousClose: 157.1, currency: "USD" },
  "VOLCABC1.LM": { price: 0.48, previousClose: 0.47, currency: "PEN" },
  "SPY": { price: 624.2, previousClose: 621.8, currency: "USD" },
  "BIL": { price: 91.74, previousClose: 91.72, currency: "USD" }
};

export type MarketDataProvider = {
  name: string;
  getQuote(symbol: string, market?: string): Promise<MarketQuote>;
};

export const manualMarketDataProvider: MarketDataProvider = {
  name: "manual-demo-provider",
  async getQuote(symbol: string, market = "GLOBAL") {
    const normalized = symbol.trim().toUpperCase();
    const fallback = deterministicFallbackQuote(normalized);
    const quote = demoPrices[normalized] ?? fallback;
    const change = quote.price - quote.previousClose;
    const changePercent = quote.previousClose ? (change / quote.previousClose) * 100 : 0;

    return {
      symbol: normalized,
      market,
      currency: quote.currency,
      price: roundMoney(quote.price),
      previousClose: roundMoney(quote.previousClose),
      change: roundMoney(change),
      changePercent: roundMoney(changePercent),
      asOf: new Date().toISOString(),
      provider: this.name,
      delayed: true,
      disclaimer: "Demo market data. Replace with an authorized provider before production."
    };
  }
};

export async function valuePortfolio(
  positions: PortfolioInputPosition[],
  baseCurrency: BinvCurrency,
  provider: MarketDataProvider = manualMarketDataProvider
): Promise<PortfolioValuation> {
  const valued = await Promise.all(positions.map(async (position) => {
    const quote = position.source === "manual" && position.lastManualPrice
      ? manualQuoteFromPosition(position)
      : await provider.getQuote(position.symbol, position.market);
    const currentPrice = quote.price;
    const marketValue = currentPrice * position.quantity;
    const costBasis = position.averageCost * position.quantity;
    const unrealizedPnl = marketValue - costBasis;
    const unrealizedPnlPercent = costBasis ? (unrealizedPnl / costBasis) * 100 : 0;

    return {
      ...position,
      currentPrice: roundMoney(currentPrice),
      marketValue: roundMoney(marketValue),
      costBasis: roundMoney(costBasis),
      unrealizedPnl: roundMoney(unrealizedPnl),
      unrealizedPnlPercent: roundMoney(unrealizedPnlPercent),
      quoteProvider: quote.provider,
      quoteAsOf: quote.asOf
    };
  }));

  const totals = valued.reduce((acc, position) => {
    acc.marketValue += position.marketValue;
    acc.costBasis += position.costBasis;
    acc.unrealizedPnl += position.unrealizedPnl;
    return acc;
  }, { marketValue: 0, costBasis: 0, unrealizedPnl: 0 });

  const unrealizedPnlPercent = totals.costBasis ? (totals.unrealizedPnl / totals.costBasis) * 100 : 0;

  return {
    baseCurrency,
    positions: valued,
    totals: {
      marketValue: roundMoney(totals.marketValue),
      costBasis: roundMoney(totals.costBasis),
      unrealizedPnl: roundMoney(totals.unrealizedPnl),
      unrealizedPnlPercent: roundMoney(unrealizedPnlPercent)
    },
    notes: [
      "Portfolio positions are entered manually by BINV or admin users.",
      "Market data provider is interchangeable and currently uses demo/delayed values.",
      "Production must use authorized data sources and custody validation."
    ]
  };
}

function deterministicFallbackQuote(symbol: string) {
  const seed = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const price = 20 + (seed % 480) + ((seed % 17) / 100);
  return { price, previousClose: price * 0.992, currency: "USD" as BinvCurrency };
}

function manualQuoteFromPosition(position: PortfolioInputPosition): MarketQuote {
  const price = position.lastManualPrice ?? position.averageCost;
  return {
    symbol: position.symbol,
    market: position.market,
    currency: position.currency,
    price,
    previousClose: price,
    change: 0,
    changePercent: 0,
    asOf: new Date().toISOString(),
    provider: "manual-position-price",
    delayed: true,
    disclaimer: "Manual price entered by BINV/admin user."
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

