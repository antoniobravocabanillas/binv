import { BinvDealStatus, BinvPartnerCategory, BinvRiskLevel, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/server/api";
import type { BinvCountry, BinvOpportunity } from "@/lib/binv/domain";
import { binvOpportunities } from "@/lib/binv/domain";

type AdminOpportunityInput = {
  code?: string;
  name: string;
  country: BinvCountry;
  assetType: string;
  operatingPartner?: string;
  ticket: number;
  currency: "USD" | "PEN" | "ARS";
  targetReturn: string;
  term: string;
  risk: "Conservador" | "Moderado" | "Alto" | "Profesional" | "Institucional";
  status: "Abierta" | "En análisis" | "Próximamente" | "Solo clientes calificados" | "Cerrada" | "En estructuración" | "Derivada a aliado";
  summary: string;
  thesis?: string;
  legalStructure?: string;
  mainRisks?: string[];
  requiresKyc: boolean;
  requiresQualifiedProfile: boolean;
};

type OpportunityWithPartner = Prisma.BinvOpportunityGetPayload<{
  include: { operatingPartner: true };
}>;

const countryDefaults: Record<"PE" | "AR" | "GLOBAL", { label: string; baseCurrency: "USD" | "PEN" | "ARS"; secondaryCurrency?: "PEN" | "ARS"; context: string }> = {
  PE: {
    label: "Peru",
    baseCurrency: "USD",
    secondaryCurrency: "PEN",
    context: "Peru, nuam, Bolsa de Lima y oportunidades regionales con foco patrimonial high-ticket."
  },
  AR: {
    label: "Argentina",
    baseCurrency: "USD",
    secondaryCurrency: "ARS",
    context: "Argentina, BYMA, MAE/A3 Mercados, ALyCs aliadas y acceso internacional segun perfil."
  },
  GLOBAL: {
    label: "Global",
    baseCurrency: "USD",
    context: "Acceso internacional sujeto a perfil, aliado operativo y documentacion aplicable."
  }
};

const riskToDb: Record<AdminOpportunityInput["risk"], BinvRiskLevel> = {
  Conservador: BinvRiskLevel.CONSERVATIVE,
  Moderado: BinvRiskLevel.MODERATE,
  Alto: BinvRiskLevel.HIGH,
  Profesional: BinvRiskLevel.PROFESSIONAL,
  Institucional: BinvRiskLevel.INSTITUTIONAL
};

const statusToDb: Record<AdminOpportunityInput["status"], BinvDealStatus> = {
  Abierta: BinvDealStatus.OPEN,
  "En análisis": BinvDealStatus.IN_ANALYSIS,
  Próximamente: BinvDealStatus.COMING_SOON,
  "Solo clientes calificados": BinvDealStatus.QUALIFIED_CLIENTS_ONLY,
  Cerrada: BinvDealStatus.CLOSED,
  "En estructuración": BinvDealStatus.STRUCTURING,
  "Derivada a aliado": BinvDealStatus.REFERRED_TO_PARTNER
};

const riskFromDb: Record<BinvRiskLevel, BinvOpportunity["risk"]> = {
  CONSERVATIVE: "Conservador",
  MODERATE: "Moderado",
  HIGH: "Alto",
  PROFESSIONAL: "Profesional",
  INSTITUTIONAL: "Institucional"
};

const statusFromDb: Record<BinvDealStatus, BinvOpportunity["status"]> = {
  OPEN: "Abierta",
  IN_ANALYSIS: "En analisis",
  COMING_SOON: "Proximamente",
  QUALIFIED_CLIENTS_ONLY: "Solo clientes calificados",
  CLOSED: "Cerrada",
  STRUCTURING: "En estructuracion",
  REFERRED_TO_PARTNER: "Derivada a aliado"
};

export function serializeDbOpportunity(item: OpportunityWithPartner): BinvOpportunity {
  return {
    id: item.code || item.id,
    name: item.name,
    country: item.countryCode,
    assetType: item.assetType,
    operatingPartner: item.operatingPartner?.name ?? "En estructuracion",
    ticket: Number(item.ticketMinimum),
    currency: item.currency,
    targetReturn: item.targetReturn,
    term: item.term,
    risk: riskFromDb[item.riskLevel],
    status: statusFromDb[item.status],
    summary: item.summary,
    requiresKyc: item.requiresKyc,
    requiresQualifiedProfile: item.requiresQualifiedProfile
  };
}

export async function findOpportunities(country?: BinvCountry, assetType?: string) {
  const where: Prisma.BinvOpportunityWhereInput = {
    AND: [
      country && country !== "GLOBAL"
        ? { OR: [{ countryCode: country }, { countryCode: "GLOBAL" }] }
        : {},
      assetType && assetType !== "Todos" ? { assetType } : {}
    ]
  };

  const rows = await prisma.binvOpportunity.findMany({
    where,
    include: { operatingPartner: true },
    orderBy: [{ updatedAt: "desc" }]
  });

  return rows.map(serializeDbOpportunity);
}

export function fallbackOpportunities(country?: BinvCountry, assetType?: string) {
  return binvOpportunities.filter((item) => {
    const countryMatch = !country || country === "GLOBAL" || item.country === country || item.country === "GLOBAL";
    const assetMatch = !assetType || assetType === "Todos" || item.assetType === assetType;
    return countryMatch && assetMatch;
  });
}

export async function ensureCountry(code: "PE" | "AR" | "GLOBAL") {
  const data = countryDefaults[code];
  return prisma.binvCountry.upsert({
    where: { code },
    update: {
      label: data.label,
      baseCurrency: data.baseCurrency,
      secondaryCurrency: data.secondaryCurrency,
      context: data.context,
      active: true
    },
    create: {
      code,
      label: data.label,
      baseCurrency: data.baseCurrency,
      secondaryCurrency: data.secondaryCurrency,
      context: data.context,
      active: true
    }
  });
}

export async function ensurePartner(name: string | undefined, countryCode: "PE" | "AR" | "GLOBAL") {
  if (!name?.trim()) return null;
  const country = await ensureCountry(countryCode);
  const existing = await prisma.binvPartner.findFirst({
    where: { name: name.trim(), countryId: country.id }
  });
  if (existing) return existing;

  return prisma.binvPartner.create({
    data: {
      name: name.trim(),
      category: name.toLowerCase().includes("byma") || name.toLowerCase().includes("mae") || name.toLowerCase().includes("nuam")
        ? BinvPartnerCategory.MARKET_INFRASTRUCTURE
        : name.toLowerCase().includes("urbania")
          ? BinvPartnerCategory.BINV_VERTICAL
          : BinvPartnerCategory.OPERATING_PARTNER,
      countryId: country.id,
      roleDescription: "Aliado, infraestructura o vertical asociada administrada desde BINV.",
      active: true
    }
  });
}

export async function createOpportunity(payload: AdminOpportunityInput) {
  const code = payload.code?.trim() || slugify(`${payload.country}-${payload.name}`);
  const country = await ensureCountry(payload.country);
  const partner = await ensurePartner(payload.operatingPartner, payload.country);

  const row = await prisma.binvOpportunity.create({
    data: {
      code,
      name: payload.name,
      countryId: country.id,
      countryCode: payload.country,
      assetType: payload.assetType,
      operatingPartnerId: partner?.id,
      ticketMinimum: payload.ticket,
      currency: payload.currency,
      targetReturn: payload.targetReturn,
      term: payload.term,
      riskLevel: riskToDb[payload.risk],
      status: statusToDb[payload.status],
      summary: payload.summary,
      thesis: payload.thesis,
      legalStructure: payload.legalStructure,
      mainRisks: payload.mainRisks ?? [],
      requiresKyc: payload.requiresKyc,
      requiresQualifiedProfile: payload.requiresQualifiedProfile
    },
    include: { operatingPartner: true }
  });

  return serializeDbOpportunity(row);
}

export async function updateOpportunity(idOrCode: string, payload: Partial<AdminOpportunityInput>) {
  const existing = await prisma.binvOpportunity.findFirstOrThrow({
    where: { OR: [{ id: idOrCode }, { code: idOrCode }] }
  });
  const country = payload.country ? await ensureCountry(payload.country) : null;
  const partner = payload.operatingPartner ? await ensurePartner(payload.operatingPartner, payload.country ?? existing.countryCode) : null;

  const data: Prisma.BinvOpportunityUpdateInput = {
    ...(payload.code ? { code: payload.code } : {}),
    ...(payload.name ? { name: payload.name } : {}),
    ...(payload.country ? { country: { connect: { id: country!.id } }, countryCode: payload.country } : {}),
    ...(payload.assetType ? { assetType: payload.assetType } : {}),
    ...(payload.operatingPartner ? { operatingPartner: partner ? { connect: { id: partner.id } } : { disconnect: true } } : {}),
    ...(payload.ticket !== undefined ? { ticketMinimum: payload.ticket } : {}),
    ...(payload.currency ? { currency: payload.currency } : {}),
    ...(payload.targetReturn ? { targetReturn: payload.targetReturn } : {}),
    ...(payload.term ? { term: payload.term } : {}),
    ...(payload.risk ? { riskLevel: riskToDb[payload.risk] } : {}),
    ...(payload.status ? { status: statusToDb[payload.status] } : {}),
    ...(payload.summary ? { summary: payload.summary } : {}),
    ...(payload.thesis !== undefined ? { thesis: payload.thesis } : {}),
    ...(payload.legalStructure !== undefined ? { legalStructure: payload.legalStructure } : {}),
    ...(payload.mainRisks ? { mainRisks: payload.mainRisks } : {}),
    ...(payload.requiresKyc !== undefined ? { requiresKyc: payload.requiresKyc } : {}),
    ...(payload.requiresQualifiedProfile !== undefined ? { requiresQualifiedProfile: payload.requiresQualifiedProfile } : {})
  };

  const row = await prisma.binvOpportunity.update({
    where: { id: existing.id },
    data,
    include: { operatingPartner: true }
  });

  return serializeDbOpportunity(row);
}

export async function deleteOpportunity(idOrCode: string) {
  const existing = await prisma.binvOpportunity.findFirstOrThrow({
    where: { OR: [{ id: idOrCode }, { code: idOrCode }] }
  });
  await prisma.binvOpportunity.delete({ where: { id: existing.id } });
  return { id: existing.code || existing.id };
}

