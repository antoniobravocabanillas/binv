import { created, handleApiError, parseJson } from "@/lib/server/api";
import { financingRequestSchema } from "@/lib/validations/binv";

const argentinaInstruments = ["Descuento de cheques", "Pagares", "Facturas de credito", "Obligaciones negociables", "Fideicomisos financieros", "Deuda privada"];
const peruInstruments = ["Financiamiento estructurado", "Private debt", "Inversores calificados", "Real estate financing", "Financiamiento puente", "Estructuras privadas"];

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, financingRequestSchema);
    const recommended = payload.instrument || recommendInstrument(payload.country, payload.amountRequested);

    return created({
      id: `fin-${Date.now()}`,
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

