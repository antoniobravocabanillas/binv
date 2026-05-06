export type BinvCountry = "PE" | "AR" | "GLOBAL";
export type BinvCurrency = "USD" | "PEN" | "ARS";
export type BinvRisk = "Conservador" | "Moderado" | "Alto" | "Profesional" | "Institucional";
export type BinvOpportunityStatus = "Abierta" | "En analisis" | "Proximamente" | "Solo clientes calificados" | "Cerrada" | "En estructuracion" | "Derivada a aliado";
export type BinvKycStatus = "Aprobado" | "En revision" | "Pendiente";
export type BinvRole = "Cliente inversionista" | "Empresa solicitante" | "Asesor" | "Admin BINV" | "Aliado externo";

export type BinvSessionUser = {
  id: string;
  name: string;
  role: BinvRole;
  kycStatus: BinvKycStatus;
  kybStatus: BinvKycStatus;
  profile: "Publico" | "Calificado" | "Institucional";
  country: "PE" | "AR";
};

export type BinvOpportunity = {
  id: string;
  name: string;
  country: BinvCountry;
  assetType: string;
  operatingPartner: string;
  ticket: number;
  currency: BinvCurrency;
  targetReturn: string;
  term: string;
  risk: BinvRisk;
  status: BinvOpportunityStatus;
  summary: string;
  requiresKyc: boolean;
  requiresQualifiedProfile: boolean;
};

export type PortfolioInputPosition = {
  symbol: string;
  market: string;
  name: string;
  currency: BinvCurrency;
  quantity: number;
  averageCost: number;
  lastManualPrice?: number;
  source?: "manual" | "market-data";
};

export type MarketQuote = {
  symbol: string;
  market: string;
  currency: BinvCurrency;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  asOf: string;
  provider: string;
  delayed: boolean;
  disclaimer: string;
};

export type ValuedPortfolioPosition = PortfolioInputPosition & {
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  quoteProvider: string;
  quoteAsOf: string;
};

export type PortfolioValuation = {
  baseCurrency: BinvCurrency;
  positions: ValuedPortfolioPosition[];
  totals: {
    marketValue: number;
    costBasis: number;
    unrealizedPnl: number;
    unrealizedPnlPercent: number;
  };
  notes: string[];
};

export const binvOpportunities: BinvOpportunity[] = [
  {
    id: "pe-urbania-miraflores",
    name: "Urbania Miraflores 218",
    country: "PE",
    assetType: "Real estate",
    operatingPartner: "Urbania Capital",
    ticket: 75000,
    currency: "USD",
    targetReturn: "13% - 16% objetivo anual",
    term: "30 meses",
    risk: "Profesional",
    status: "Solo clientes calificados",
    summary: "Proyecto inmobiliario ejecutado en Peru con data room sujeto a KYC/KYB.",
    requiresKyc: true,
    requiresQualifiedProfile: true
  },
  {
    id: "pe-nuam-income",
    name: "Estrategia Regional nuam Income",
    country: "PE",
    assetType: "Mercado de valores",
    operatingPartner: "INVIU",
    ticket: 50000,
    currency: "USD",
    targetReturn: "8.5% - 10.2% objetivo anual",
    term: "12-24 meses",
    risk: "Moderado",
    status: "Abierta",
    summary: "Cartera referencial vinculada a instrumentos regionales del ecosistema nuam.",
    requiresKyc: true,
    requiresQualifiedProfile: false
  },
  {
    id: "ar-renta-fija",
    name: "Renta Fija Argentina Curada",
    country: "AR",
    assetType: "Renta fija",
    operatingPartner: "INVIU",
    ticket: 30000,
    currency: "USD",
    targetReturn: "9% - 14% objetivo anual",
    term: "6-18 meses",
    risk: "Alto",
    status: "Abierta",
    summary: "Seleccion de instrumentos de renta fija disponibles via aliados.",
    requiresKyc: true,
    requiresQualifiedProfile: false
  },
  {
    id: "ar-cheques",
    name: "Descuento de cheques corporativo",
    country: "AR",
    assetType: "Financiamiento estructurado",
    operatingPartner: "ECOVALORES",
    ticket: 25000,
    currency: "ARS",
    targetReturn: "Tasa de mercado segun instrumento",
    term: "30-180 dias",
    risk: "Moderado",
    status: "Derivada a aliado",
    summary: "Estructura informativa para descuento de cheques y facturas de credito.",
    requiresKyc: true,
    requiresQualifiedProfile: false
  },
  {
    id: "global-usd-conservative",
    name: "Estrategia USD Conservadora",
    country: "GLOBAL",
    assetType: "Liquidez",
    operatingPartner: "INVIU / Interactive Brokers",
    ticket: 50000,
    currency: "USD",
    targetReturn: "Objetivo variable por tasa y activo",
    term: "Liquidez segun instrumento",
    risk: "Conservador",
    status: "Abierta",
    summary: "Arquitectura de liquidez y renta corta en USD para preservacion patrimonial.",
    requiresKyc: true,
    requiresQualifiedProfile: false
  }
];

export function canAccessDataRoom(user: BinvSessionUser, opportunity: BinvOpportunity) {
  if (user.role === "Admin BINV" || user.role === "Asesor") return true;
  if (opportunity.requiresQualifiedProfile && user.profile === "Publico") return false;
  if (opportunity.requiresKyc && user.kycStatus !== "Aprobado") return false;
  return true;
}

export function filterOpportunities(country?: BinvCountry, assetType?: string) {
  return binvOpportunities.filter((item) => {
    const countryMatch = !country || country === "GLOBAL" || item.country === country || item.country === "GLOBAL";
    const assetMatch = !assetType || assetType === "Todos" || item.assetType === assetType;
    return countryMatch && assetMatch;
  });
}

