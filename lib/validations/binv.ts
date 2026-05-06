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

