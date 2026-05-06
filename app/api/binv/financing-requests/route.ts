import { created, handleApiError, parseJson } from "@/lib/server/api";
import { prisma } from "@/lib/prisma";
import { ensureCountry } from "@/lib/binv/repository";
import { financingRequestSchema } from "@/lib/validations/binv";

const argentinaInstruments = ["Descuento de cheques", "Pagares", "Facturas de credito", "Obligaciones negociables", "Fideicomisos financieros", "Deuda privada"];
const peruInstruments = ["Financiamiento estructurado", "Private debt", "Inversores calificados", "Real estate financing", "Financiamiento puente", "Estructuras privadas"];

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, financingRequestSchema);
    const recommended = payload.instrument || recommendInstrument(payload.country, payload.amountRequested);
    const country = await ensureCountry(payload.country);
    const company = await prisma.binvCompanyProfile.upsert({
      where: { countryCode_taxId: { countryCode: payload.country, taxId: payload.taxId } },
      update: {
        legalName: payload.legalName,
        sector: payload.sector,
        annualRevenue: numericRevenue(payload.revenue)
      },
      create: {
        legalName: payload.legalName,
        taxId: payload.taxId,
        countryCode: payload.country,
        sector: payload.sector,
        annualRevenue: numericRevenue(payload.revenue)
      }
    });
    const financingRequest = await prisma.binvFinancingRequest.create({
      data: {
        countryId: country.id,
        countryCode: payload.country,
        companyProfileId: company.id,
        legalName: payload.legalName,
        taxId: payload.taxId,
        sector: payload.sector,
        revenue: payload.revenue,
        amountRequested: payload.amountRequested,
        currency: payload.currency,
        useOfFunds: payload.useOfFunds,
        desiredTerm: payload.desiredTerm,
        guarantees: payload.guarantees,
        possibleInstrument: recommended,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        notes: payload.notes
      }
    });

    return created({
      id: financingRequest.id,
      status: "Recibido",
      pipeline: [
        "Recibido",
        "En analisis BINV",
        "Documentacion requerida",
        "Perfilamiento de instrumento",
        "Enviado a aliado",
        "En evaluacion por aliado",
        "Aprobado / Rechazado",
        "Cerrado"
      ],
      recommendedInstrument: recommended,
      possibleInstruments: payload.country === "AR" ? argentinaInstruments : peruInstruments,
      nextAction: "Analista BINV revisa documentacion, garantias y destino de fondos antes de derivar a un aliado operativo.",
      request: payload
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function recommendInstrument(country: "PE" | "AR", amount: number) {
  if (country === "AR") {
    if (amount < 50000) return "Descuento de cheques / Facturas de credito";
    if (amount < 250000) return "Pagares / Deuda privada";
    return "Obligaciones negociables / Fideicomiso financiero";
  }

  if (amount < 75000) return "Financiamiento puente / estructura privada";
  if (amount < 300000) return "Private debt";
  return "Financiamiento estructurado con inversionistas calificados";
}

function numericRevenue(value: string) {
  const normalized = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(normalized) && normalized > 0 ? normalized : undefined;
}
