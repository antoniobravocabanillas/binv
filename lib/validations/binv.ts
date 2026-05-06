import { z } from "zod";

export const countrySchema = z.enum(["PE", "AR", "GLOBAL"]);
export const currencySchema = z.enum(["USD", "PEN", "ARS"]);

export const binvUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(["Cliente inversionista", "Empresa solicitante", "Asesor", "Admin BINV", "Aliado externo"]),
  kycStatus: z.enum(["Aprobado", "En revision", "Pendiente"]),
  kybStatus: z.enum(["Aprobado", "En revision", "Pendiente"]),
  profile: z.enum(["Publico", "Calificado", "Institucional"]),
  country: z.enum(["PE", "AR"])
});

export const portfolioPositionSchema = z.object({
  symbol: z.string().min(1).max(24),
  market: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  currency: currencySchema,
  quantity: z.coerce.number().positive(),
  averageCost: z.coerce.number().nonnegative(),
  lastManualPrice: z.coerce.number().positive().optional(),
  source: z.enum(["manual", "market-data"]).optional()
});

export const portfolioValuationSchema = z.object({
  baseCurrency: currencySchema.default("USD"),
  positions: z.array(portfolioPositionSchema).min(1).max(100)
});

export const financingRequestSchema = z.object({
  country: z.enum(["PE", "AR"]),
  legalName: z.string().min(2),
  taxId: z.string().min(4),
  sector: z.string().min(2),
  revenue: z.string().min(2),
  amountRequested: z.coerce.number().positive(),
  currency: currencySchema,
  useOfFunds: z.string().min(5),
  desiredTerm: z.string().min(2),
  guarantees: z.string().optional(),
  instrument: z.string().optional(),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  notes: z.string().optional()
});

export const dataRoomAccessSchema = z.object({
  user: binvUserSchema,
  opportunityId: z.string().min(1)
});

const optionalText = (max = 600) => z.preprocess((value) => value === "" ? undefined : value, z.string().max(max).optional());

export const adminOpportunitySchema = z.object({
  code: z.preprocess((value) => value === "" ? undefined : value, z.string().min(2).max(80).optional()),
  name: z.string().min(3).max(160),
  country: countrySchema,
  assetType: z.string().min(2).max(80),
  operatingPartner: z.preprocess((value) => value === "" ? undefined : value, z.string().min(2).max(120).optional()),
  ticket: z.coerce.number().nonnegative(),
  currency: currencySchema,
  targetReturn: z.string().min(2).max(120),
  term: z.string().min(2).max(80),
  risk: z.enum(["Conservador", "Moderado", "Alto", "Profesional", "Institucional"]),
  status: z.enum(["Abierta", "En análisis", "Próximamente", "Solo clientes calificados", "Cerrada", "En estructuración", "Derivada a aliado"]),
  summary: z.string().min(10).max(600),
  thesis: optionalText(1200),
  legalStructure: optionalText(600),
  mainRisks: z.array(z.string().min(2).max(160)).max(8).optional(),
  requiresKyc: z.coerce.boolean().default(true),
  requiresQualifiedProfile: z.coerce.boolean().default(false)
});

export const adminOpportunityPatchSchema = adminOpportunitySchema.partial().extend({
  id: z.string().min(1).optional()
});

export const adminFinancingStatusSchema = z.object({
  status: z.enum(["RECEIVED", "BINV_ANALYSIS", "DOCUMENTATION_REQUIRED", "SENT_TO_PARTNER", "PARTNER_REVIEW", "APPROVED", "REJECTED", "CLOSED"]),
  notes: z.string().max(1000).optional()
});
