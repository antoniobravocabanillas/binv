"use client";

import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  Handshake,
  Landmark,
  LockKeyhole,
  LogIn,
  Menu,
  PieChart,
  Search,
  ShieldCheck,
  Upload,
  UserRoundCheck,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCurrency } from "@/lib/utils";

type CountryCode = "PE" | "AR";
type MarketCountry = CountryCode | "GLOBAL";
type View =
  | "home"
  | "dashboard"
  | "investments"
  | "deal"
  | "portfolio"
  | "urbania"
  | "financing"
  | "investors"
  | "admin"
  | "login"
  | "profile"
  | "kyc"
  | "partners"
  | "legal"
  | "faq";

type RiskLevel = "Conservador" | "Moderado" | "Alto" | "Profesional" | "Institucional";
type DealStatus = "Abierta" | "En análisis" | "Próximamente" | "Solo clientes calificados" | "Cerrada" | "En estructuración" | "Derivada a aliado";
type UserRole = "Cliente inversionista" | "Empresa solicitante" | "Asesor" | "Admin BINV" | "Aliado externo";
type KycState = "Aprobado" | "En revisión" | "Pendiente";

type DemoUser = {
  name: string;
  role: UserRole;
  kyc: KycState;
  kyb: KycState;
  profile: "Público" | "Calificado" | "Institucional";
};

type Partner = {
  name: string;
  category: "Aliado operativo" | "Infraestructura de mercado" | "Custodia / acceso internacional" | "Vertical BINV" | "Referencia regional";
  role: string;
};

type Opportunity = {
  id: string;
  name: string;
  country: MarketCountry;
  assetType: string;
  operatingPartner: string;
  partnerRole: string;
  referralStatus: string;
  marketReference: string;
  binvRole: string;
  ticket: number;
  currency: "USD" | "PEN" | "ARS";
  targetReturn: string;
  term: string;
  risk: RiskLevel;
  status: DealStatus;
  summary: string;
  thesis: string;
  structure: string;
  legal: string;
};

type ApiOpportunity = {
  id: string;
  name: string;
  country: MarketCountry;
  assetType: string;
  operatingPartner: string;
  ticket: number;
  currency: "USD" | "PEN" | "ARS";
  targetReturn: string;
  term: string;
  risk: RiskLevel;
  status: string;
  summary: string;
  requiresKyc: boolean;
  requiresQualifiedProfile: boolean;
};

type PortfolioPosition = {
  name: string;
  country: MarketCountry;
  currency: "USD" | "PEN" | "ARS";
  operatingPartner: string;
  custodian: string;
  committed: number;
  entryDate: string;
  status: string;
  roi: string;
  nextDistribution: string;
  dataSource: string;
  updatedAt: string;
  documents: string;
};

type MarketValuationPosition = {
  symbol: string;
  market: string;
  name: string;
  currency: "USD" | "PEN" | "ARS";
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  quoteProvider: string;
  quoteAsOf: string;
};

type PortfolioValuation = {
  baseCurrency: "USD" | "PEN" | "ARS";
  positions: MarketValuationPosition[];
  totals: {
    marketValue: number;
    costBasis: number;
    unrealizedPnl: number;
    unrealizedPnlPercent: number;
  };
  notes: string[];
};

type DataRoomAccessResult = {
  allowed: boolean;
  reason: string;
};

type FinancingResponse = {
  id: string;
  status: string;
  pipeline: string[];
  recommendedInstrument: string;
  possibleInstruments: string[];
  nextAction: string;
};

const countryConfig: Record<CountryCode, {
  label: string;
  flag: string;
  baseCurrency: "USD" | "PEN" | "ARS";
  secondaryCurrency: "PEN" | "ARS";
  context: string;
  dashboardCustodian: string;
  riskProfile: string;
  nextAction: string;
  urbaniaPositioning: string;
  financingIntro: string;
}> = {
  PE: {
    label: "Perú",
    flag: "🇵🇪",
    baseCurrency: "USD",
    secondaryCurrency: "PEN",
    context: "Perú, nuam, Bolsa de Lima y oportunidades regionales con foco patrimonial high-ticket.",
    dashboardCustodian: "INVIU / Urbania Capital según oportunidad",
    riskProfile: "Moderado institucional",
    nextAction: "Revisar acceso a data room Urbania y actualizar declaración de origen de fondos.",
    urbaniaPositioning: "Vertical inmobiliaria local para proyectos ejecutados en Perú.",
    financingIntro: "Estructuras privadas, private debt, real estate financing y alternativas regionales vinculadas a nuam cuando aplique."
  },
  AR: {
    label: "Argentina",
    flag: "🇦🇷",
    baseCurrency: "USD",
    secondaryCurrency: "ARS",
    context: "Argentina, BYMA, MAE/A3 Mercados, ALyCs aliadas y acceso internacional según perfil.",
    dashboardCustodian: "INVIU / ADCAP / ECOVALORES / Interactive Brokers según posición",
    riskProfile: "Profesional con exposición mercado argentino",
    nextAction: "Validar documentación para instrumentos PyME y confirmar aliado operativo de ejecución.",
    urbaniaPositioning: "Vertical inmobiliaria regional disponible para clientes argentinos, con proyectos ejecutados en Perú.",
    financingIntro: "Financiamiento PyME vía mercado de capitales, deuda privada y estructuras corporativas con aliados autorizados."
  }
};

const partnersByCountry: Record<CountryCode, Partner[]> = {
  PE: [
    { name: "INVIU", category: "Aliado operativo", role: "Canal operativo / plataforma aliada para relación asesor-inversor." },
    { name: "Urbania Capital", category: "Vertical BINV", role: "Vertical de real estate estructurado con proyectos ejecutados en Perú." },
    { name: "nuam", category: "Referencia regional", role: "Infraestructura regional y referencia de mercado, no aliado comercial directo." },
    { name: "Interactive Brokers", category: "Custodia / acceso internacional", role: "Acceso o custodia internacional cuando corresponda mediante estructura o aliado." }
  ],
  AR: [
    { name: "INVIU", category: "Aliado operativo", role: "Canal operativo / plataforma aliada." },
    { name: "ADCAP", category: "Aliado operativo", role: "Aliado de mercado de capitales Argentina." },
    { name: "ECOVALORES", category: "Aliado operativo", role: "ALyC y aliado operativo para mercado argentino." },
    { name: "Interactive Brokers", category: "Custodia / acceso internacional", role: "Acceso/custodia internacional fuera de la plataforma BINV." },
    { name: "BYMA", category: "Infraestructura de mercado", role: "Infraestructura y referencia del mercado de capitales argentino." },
    { name: "MAE/A3 Mercados", category: "Infraestructura de mercado", role: "Infraestructura y referencia de negociación, renta fija y herramientas de mercado." }
  ]
};

const opportunitiesByCountry: Record<CountryCode, Opportunity[]> = {
  PE: [
    {
      id: "pe-urbania-miraflores",
      name: "Urbania Miraflores 218",
      country: "PE",
      assetType: "Real estate",
      operatingPartner: "Urbania Capital",
      partnerRole: "Vertical real estate / estructuración inmobiliaria.",
      referralStatus: "Acceso a data room sujeto a KYC/KYB",
      marketReference: "Proyecto inmobiliario ejecutado en Perú",
      binvRole: "Originador, estructurador y curador",
      ticket: 75000,
      currency: "USD",
      targetReturn: "13% - 16% objetivo anual",
      term: "30 meses",
      risk: "Profesional",
      status: "Solo clientes calificados",
      summary: "Proyecto multifamily en Lima con estructura privada, documentación legal específica y seguimiento de obra.",
      thesis: "Ubicación prime, demanda residencial sostenida y salida proyectada por venta o distribución según estructura final.",
      structure: "Contrato privado / vehículo inmobiliario en evaluación.",
      legal: "Sujeto a documentación legal, perfil del cliente, disponibilidad y validación del vehículo aplicable."
    },
    {
      id: "pe-nuam-income",
      name: "Estrategia Regional nuam Income",
      country: "PE",
      assetType: "Mercado de valores",
      operatingPartner: "INVIU",
      partnerRole: "Canal operativo / plataforma aliada.",
      referralStatus: "Lista para evaluación con asesor BINV",
      marketReference: "nuam / Bolsa de Lima / mercado regional",
      binvRole: "Asesor y curador de oportunidad",
      ticket: 50000,
      currency: "USD",
      targetReturn: "8.5% - 10.2% objetivo anual",
      term: "12-24 meses",
      risk: "Moderado",
      status: "Abierta",
      summary: "Cartera referencial de instrumentos regionales vinculados al ecosistema nuam.",
      thesis: "La integración regional amplía emisores, profundidad y alternativas para clientes patrimoniales.",
      structure: "Cuenta/plataforma aliada según perfil y documentación final.",
      legal: "La ejecución, custodia y liquidación dependen del aliado operativo correspondiente."
    },
    {
      id: "pe-private-debt",
      name: "Private Debt Perú",
      country: "PE",
      assetType: "Deuda privada",
      operatingPartner: "INVIU",
      partnerRole: "Canal operativo y relación con inversor calificado.",
      referralStatus: "En revisión BINV",
      marketReference: "Estructuras privadas Perú",
      binvRole: "Originador y estructurador",
      ticket: 100000,
      currency: "USD",
      targetReturn: "11% - 14% objetivo anual",
      term: "18-36 meses",
      risk: "Profesional",
      status: "En estructuración",
      summary: "Financiamiento privado para empresas con análisis de garantías, flujo y documentación societaria.",
      thesis: "Oportunidad de retorno ajustado por riesgo mediante originación privada y control documental.",
      structure: "Contrato privado / deuda estructurada en evaluación.",
      legal: "No constituye oferta pública; acceso sujeto a perfil, documentación y validación legal."
    },
    {
      id: "pe-bridge-real-estate",
      name: "Real Estate Bridge Financing",
      country: "PE",
      assetType: "Financiamiento estructurado",
      operatingPartner: "Urbania Capital",
      partnerRole: "Vertical real estate / estructuración inmobiliaria.",
      referralStatus: "Próxima apertura",
      marketReference: "Real estate Perú",
      binvRole: "Estructurador y curador",
      ticket: 60000,
      currency: "USD",
      targetReturn: "10% - 13% objetivo anual",
      term: "12-18 meses",
      risk: "Alto",
      status: "Próximamente",
      summary: "Financiamiento puente para proyectos inmobiliarios con documentación y garantías en revisión.",
      thesis: "Necesidades de capital de corto plazo en proyectos con avance comercial y control de hitos.",
      structure: "Fideicomiso / contrato privado / vehículo en evaluación.",
      legal: "Disponibilidad sujeta a validación del proyecto, permisos, garantías y documentación final."
    }
  ],
  AR: [
    {
      id: "ar-renta-fija",
      name: "Renta Fija Argentina Curada",
      country: "AR",
      assetType: "Renta fija",
      operatingPartner: "INVIU",
      partnerRole: "Canal operativo / plataforma aliada.",
      referralStatus: "Lista para evaluación",
      marketReference: "BYMA / MAE/A3 Mercados",
      binvRole: "Asesor y curador",
      ticket: 30000,
      currency: "USD",
      targetReturn: "9% - 14% objetivo anual",
      term: "6-18 meses",
      risk: "Alto",
      status: "Abierta",
      summary: "Selección de instrumentos de renta fija y cauciones disponibles vía aliados.",
      thesis: "Análisis por duration, moneda, emisor, liquidez y ventana de mercado.",
      structure: "Ejecución externa vía aliado operativo.",
      legal: "No constituye recomendación personalizada ni oferta pública desde BINV Capital."
    },
    {
      id: "ar-cheques",
      name: "Descuento de cheques corporativo",
      country: "AR",
      assetType: "Financiamiento estructurado",
      operatingPartner: "ECOVALORES",
      partnerRole: "Aliado mercado de capitales Argentina.",
      referralStatus: "Derivada a aliado",
      marketReference: "BYMA / instrumentos PyME",
      binvRole: "Originador y conector",
      ticket: 25000,
      currency: "ARS",
      targetReturn: "Tasa de mercado según instrumento",
      term: "30-180 días",
      risk: "Moderado",
      status: "Derivada a aliado",
      summary: "Estructura informativa para descuento de cheques y facturas de crédito de empresas evaluadas.",
      thesis: "Herramienta de financiamiento productivo con análisis de pagador, plazo y liquidez.",
      structure: "Operación bursátil ejecutada por aliado autorizado.",
      legal: "Aprobación, liquidación y custodia dependen del aliado operativo y mercado aplicable."
    },
    {
      id: "ar-on-privada",
      name: "Obligaciones negociables privadas",
      country: "AR",
      assetType: "Deuda privada",
      operatingPartner: "ADCAP",
      partnerRole: "Aliado mercado de capitales Argentina.",
      referralStatus: "En análisis BINV",
      marketReference: "MAE/A3 Mercados / BYMA",
      binvRole: "Estructurador y curador",
      ticket: 75000,
      currency: "USD",
      targetReturn: "Variable por emisor",
      term: "12-36 meses",
      risk: "Profesional",
      status: "En análisis",
      summary: "Análisis de emisiones corporativas y deuda privada para clientes calificados.",
      thesis: "Evaluación de capacidad de pago, garantías, covenants y liquidez secundaria esperada.",
      structure: "Instrumento de mercado o estructura privada según documentación final.",
      legal: "Sujeto a regulación CNV, perfil del cliente y aprobación del aliado operativo."
    },
    {
      id: "ar-global-ibkr",
      name: "Estrategia Global vía Interactive Brokers",
      country: "GLOBAL",
      assetType: "Internacional",
      operatingPartner: "Interactive Brokers",
      partnerRole: "Custodia / acceso internacional.",
      referralStatus: "Solicitud de evaluación",
      marketReference: "Mercados globales",
      binvRole: "Asesor y conector",
      ticket: 100000,
      currency: "USD",
      targetReturn: "Variable por estrategia",
      term: "Liquidez según activo",
      risk: "Institucional",
      status: "Próximamente",
      summary: "Acompañamiento consultivo para acceso internacional con cuenta y ejecución fuera de BINV.",
      thesis: "Diversificación global, arquitectura abierta y custodia internacional según perfil.",
      structure: "Cuenta externa / custodio internacional.",
      legal: "BINV no reemplaza a Interactive Brokers ni ejecuta operaciones en su nombre."
    }
  ]
};

const globalOpportunities: Opportunity[] = [
  {
    id: "global-usd-conservative",
    name: "Estrategia USD Conservadora",
    country: "GLOBAL",
    assetType: "Liquidez",
    operatingPartner: "INVIU / Interactive Brokers",
    partnerRole: "Plataforma aliada o custodia internacional según jurisdicción.",
    referralStatus: "Disponible para perfil aprobado",
    marketReference: "Mercados internacionales",
    binvRole: "Asesor y curador",
    ticket: 50000,
    currency: "USD",
    targetReturn: "Objetivo variable por tasa y activo",
    term: "Liquidez según instrumento",
    risk: "Conservador",
    status: "Abierta",
    summary: "Arquitectura de liquidez y renta corta en USD para preservación patrimonial.",
    thesis: "Gestión de liquidez, diversificación y control de duration en instrumentos internacionales.",
    structure: "Cuenta/custodio externo según perfil y documentación.",
    legal: "La ejecución y custodia dependen de la plataforma o custodio correspondiente."
  }
];

const financingInstrumentsByCountry: Record<CountryCode, string[]> = {
  PE: [
    "Financiamiento estructurado",
    "Private debt",
    "Inversores calificados",
    "Real estate financing",
    "Financiamiento puente",
    "Financiamiento corporativo",
    "Estructuras privadas",
    "Oportunidades regionales vinculadas a nuam"
  ],
  AR: [
    "Descuento de cheques",
    "Pagarés",
    "Facturas de crédito",
    "Obligaciones negociables",
    "Fideicomisos financieros",
    "Deuda privada",
    "Financiamiento estructurado",
    "Mercado de capitales"
  ]
};

const legalDisclaimersByCountry: Record<CountryCode, string[]> = {
  PE: [
    "BINV Capital no ejecuta operaciones bursátiles directamente desde esta plataforma.",
    "Las inversiones y financiamientos se canalizan mediante aliados autorizados cuando corresponda.",
    "La información es referencial y no constituye oferta pública, recomendación personalizada ni asesoría legal, financiera o tributaria individual.",
    "La disponibilidad depende del país, perfil del cliente, regulación aplicable, documentación y aprobación del aliado operativo.",
    "Urbania Capital presenta proyectos inmobiliarios principalmente ejecutados en Perú y sujetos a documentación legal específica."
  ],
  AR: [
    "BINV Capital no ejecuta operaciones bursátiles directamente desde esta plataforma.",
    "Las inversiones y financiamientos se canalizan mediante aliados autorizados cuando corresponda.",
    "La información es referencial y no constituye oferta pública, recomendación personalizada ni asesoría legal, financiera o tributaria individual.",
    "Los saldos, rendimientos y posiciones son informativos y deben validarse con el custodio, broker, ALyC, fiduciario, sociedad administradora, banco, plataforma o aliado correspondiente.",
    "La disponibilidad depende del país, perfil del cliente, regulación aplicable, documentación y aprobación del aliado operativo."
  ]
};

const faqByCountry: Record<CountryCode, { question: string; answer: string }[]> = {
  PE: [
    { question: "¿BINV ejecuta inversiones?", answer: "No. BINV actúa como asesor, originador, curador, estructurador y conector. La ejecución depende del aliado operativo, documentación y regulación aplicable." },
    { question: "¿Qué cambia con el selector de país?", answer: "Cambia el universo de oportunidades, aliados, instrumentos, moneda, documentación, disclaimers y contenido visible para Perú o Argentina." },
    { question: "¿Cuándo puedo acceder a un data room?", answer: "Cuando tu perfil KYC/KYB y tu clasificación de cliente permitan acceder a información sensible del deal." },
    { question: "¿Urbania Capital opera solo en Perú?", answer: "Urbania Capital puede ser visible para clientes de Perú y Argentina, pero los proyectos inmobiliarios mostrados se ejecutan principalmente en Perú." },
    { question: "¿Puedo solicitar financiamiento desde la plataforma?", answer: "Sí. Puedes iniciar una solicitud informativa. BINV analiza, estructura y deriva la operación hacia aliados cuando corresponda." },
    { question: "¿Los rendimientos están garantizados?", answer: "No. Toda rentabilidad esperada es objetivo o estimación y no garantiza resultados futuros." }
  ],
  AR: [
    { question: "¿BINV ejecuta inversiones?", answer: "No. BINV actúa como asesor, originador, curador, estructurador y conector. La ejecución depende del aliado operativo, documentación y regulación aplicable." },
    { question: "¿Qué cambia con el selector de país?", answer: "Cambia el universo de oportunidades, aliados, instrumentos, moneda, documentación, disclaimers y contenido visible para Argentina o Perú." },
    { question: "¿Interactive Brokers opera dentro de BINV?", answer: "No. Puede funcionar como acceso o custodia internacional mediante estructuras o aliados correspondientes, pero BINV no reemplaza a Interactive Brokers ni ejecuta operaciones en su nombre." },
    { question: "¿Urbania Capital está disponible para clientes argentinos?", answer: "Puede estar visible para clientes argentinos según perfil, documentación y condiciones aplicables, con proyectos ejecutados principalmente en Perú." },
    { question: "¿Puedo solicitar financiamiento desde la plataforma?", answer: "Sí. BINV analiza la solicitud, perfila instrumentos y deriva a aliados cuando corresponda." },
    { question: "¿Qué rol cumple BINV?", answer: "BINV conecta oportunidades, capital, análisis, documentación y aliados para clientes patrimoniales, empresas e inversores calificados." }
  ]
};

const urbaniaProjects = [
  {
    name: "Urbania Miraflores 218",
    location: "Miraflores, Lima",
    ticket: 75000,
    return: "13% - 16%",
    term: "30 meses",
    structure: "Contrato privado / vehículo en evaluación",
    sponsor: "Urbania Capital",
    legalStatus: "Documentación en data room",
    permits: "Municipal aprobado",
    participation: "Derechos económicos sujetos a documentación legal",
    vehicle: "Urbania Capital",
    finance: 68,
    work: 42,
    units: 14,
    status: "Construcción",
    risks: "Permisos, obra, liquidez y salida",
    documents: "Memo, permisos, modelo financiero",
    currency: "USD"
  },
  {
    name: "Urbania Barranco Lofts",
    location: "Barranco, Lima",
    ticket: 55000,
    return: "12% - 15%",
    term: "28 meses",
    structure: "Fideicomiso / SPV en evaluación",
    sponsor: "Urbania Capital",
    legalStatus: "En cierre documental",
    permits: "En cierre",
    participation: "Participación económica sujeta a contrato",
    vehicle: "Vehículo inmobiliario en evaluación",
    finance: 54,
    work: 21,
    units: 9,
    status: "Preventa",
    risks: "Preventa, permisos, ejecución y mercado",
    documents: "Term sheet, avance comercial",
    currency: "USD"
  },
  {
    name: "Urbania Arequipa Prime",
    location: "Cayma, Arequipa",
    ticket: 40000,
    return: "11% - 14%",
    term: "24 meses",
    structure: "Contrato privado en evaluación",
    sponsor: "Urbania Capital",
    legalStatus: "Factibilidad legal",
    permits: "Factibilidad",
    participation: "Derechos económicos según documentación final",
    vehicle: "Proyecto inmobiliario Perú",
    finance: 31,
    work: 8,
    units: 22,
    status: "Estructuración",
    risks: "Factibilidad, permisos, demanda y salida",
    documents: "Ficha de proyecto, cronograma",
    currency: "USD"
  }
];

const portfolioByCountry: Record<CountryCode, PortfolioPosition[]> = {
  PE: [
    { name: "Urbania Miraflores 218", country: "PE", currency: "USD", operatingPartner: "Urbania Capital", custodian: "Vehículo inmobiliario / documentación legal", committed: 90000, entryDate: "15 Feb 2025", status: "Activo", roi: "7.2% real / 14.5% esperado", nextDistribution: "USD 6,800 - Sep 2026", dataSource: "Reporte Urbania / BINV", updatedAt: "05 May 2026", documents: "Memo, contrato, avance de obra" },
    { name: "Estrategia Regional nuam Income", country: "PE", currency: "USD", operatingPartner: "INVIU", custodian: "INVIU", committed: 65000, entryDate: "08 Oct 2025", status: "En seguimiento", roi: "4.1% real / 9.4% esperado", nextDistribution: "USD 2,050 - Ago 2026", dataSource: "Plataforma aliada", updatedAt: "05 May 2026", documents: "Reporte mensual, ficha de estrategia" }
  ],
  AR: [
    { name: "Renta Fija Argentina Curada", country: "AR", currency: "USD", operatingPartner: "INVIU", custodian: "INVIU / ALyC aliada", committed: 45000, entryDate: "12 Ene 2026", status: "En seguimiento", roi: "5.8% real / 11.0% esperado", nextDistribution: "USD 1,320 - Jul 2026", dataSource: "Aliado operativo", updatedAt: "05 May 2026", documents: "Ficha de instrumento, reporte de posición" },
    { name: "Descuento de cheques corporativo", country: "AR", currency: "ARS", operatingPartner: "ECOVALORES", custodian: "ALyC / mercado correspondiente", committed: 82000000, entryDate: "21 Mar 2026", status: "Derivada a aliado", roi: "Tasa real según instrumento", nextDistribution: "ARS 5,400,000 - Jun 2026", dataSource: "Aliado operativo", updatedAt: "05 May 2026", documents: "Legajo empresa, documentación de mercado" }
  ]
};

const demoUsers: DemoUser[] = [
  { name: "Cliente patrimonial", role: "Cliente inversionista", kyc: "Aprobado", kyb: "Pendiente", profile: "Calificado" },
  { name: "Empresa solicitante", role: "Empresa solicitante", kyc: "En revisión", kyb: "En revisión", profile: "Público" },
  { name: "Asesor BINV", role: "Asesor", kyc: "Aprobado", kyb: "Aprobado", profile: "Institucional" },
  { name: "Admin BINV", role: "Admin BINV", kyc: "Aprobado", kyb: "Aprobado", profile: "Institucional" },
  { name: "Aliado operativo", role: "Aliado externo", kyc: "Aprobado", kyb: "Aprobado", profile: "Institucional" }
];

function canAccessDataRoom(user: DemoUser, deal: Opportunity) {
  if (user.role === "Admin BINV" || user.role === "Asesor") return true;
  if (deal.status === "Solo clientes calificados" || deal.status === "En estructuración") {
    return user.kyc === "Aprobado" && user.profile !== "Público";
  }
  return user.kyc === "Aprobado";
}

function toApiUser(user: DemoUser, country: CountryCode) {
  return {
    id: user.role.toLowerCase().replaceAll(" ", "-"),
    name: user.name,
    role: user.role,
    kycStatus: user.kyc === "En revisión" ? "En revision" : user.kyc,
    kybStatus: user.kyb === "En revisión" ? "En revision" : user.kyb,
    profile: user.profile === "Público" ? "Publico" : user.profile,
    country
  };
}

function roleHomeView(role: UserRole): View {
  if (role === "Empresa solicitante") return "financing";
  if (role === "Admin BINV") return "admin";
  if (role === "Aliado externo") return "partners";
  return "home";
}

const assetFilters = ["Todos", "Mercado de valores", "Renta fija", "Deuda privada", "Financiamiento estructurado", "Real estate", "Fondos", "Internacional", "Liquidez", "Alternativos"];
const riskFilters = ["Todos", "Conservador", "Moderado", "Alto", "Profesional", "Institucional"];
const statusFilters = ["Todos", "Abierta", "En análisis", "Próximamente", "Solo clientes calificados", "Cerrada", "En estructuración", "Derivada a aliado"];
const riskStyles: Record<RiskLevel, string> = {
  Conservador: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Moderado: "border-[#BFA46A]/35 bg-[#BFA46A]/12 text-[#72572A]",
  Alto: "border-[#B54708]/25 bg-[#B54708]/10 text-[#B54708]",
  Profesional: "border-[#C95B2B]/30 bg-[#C95B2B]/10 text-[#8C361B]",
  Institucional: "border-[#07111F]/20 bg-[#07111F]/[0.08] text-[#07111F]"
};

function money(value: number, currency = "USD") {
  return formatCurrency(value, currency);
}

function getVisibleOpportunities(country: CountryCode) {
  const urbania = opportunitiesByCountry.PE.filter((deal) => deal.assetType === "Real estate");
  const own = opportunitiesByCountry[country];
  const merged = country === "AR" ? [...own, ...urbania, ...globalOpportunities] : [...own, ...globalOpportunities];
  return Array.from(new Map(merged.map((deal) => [deal.id, deal])).values());
}

function mergeApiOpportunities(country: CountryCode, apiItems: ApiOpportunity[]) {
  const local = getVisibleOpportunities(country);
  const merged = new Map(local.map((deal) => [deal.id, deal]));

  apiItems.forEach((item) => {
    const existing = merged.get(item.id);
    merged.set(item.id, {
      ...(existing ?? {
        partnerRole: "Aliado operativo / fuente backend.",
        referralStatus: item.requiresKyc ? "Acceso sujeto a KYC/KYB" : "Vista pública",
        marketReference: item.country === "AR" ? "Mercado argentino" : item.country === "PE" ? "Mercado peruano / regional" : "Mercados globales",
        binvRole: "Originador, asesor, estructurador y conector",
        thesis: item.summary,
        structure: "Estructura sujeta a documentación final.",
        legal: "Disponibilidad sujeta a perfil, país y aliado operativo."
      }),
      id: item.id,
      name: item.name,
      country: item.country,
      assetType: item.assetType,
      operatingPartner: item.operatingPartner,
      ticket: item.ticket,
      currency: item.currency,
      targetReturn: item.targetReturn,
      term: item.term,
      risk: item.risk,
      status: normalizeDealStatus(item.status),
      summary: item.summary
    });
  });

  return Array.from(merged.values());
}

function normalizeDealStatus(status: string): DealStatus {
  const map: Record<string, DealStatus> = {
    "En analisis": "En análisis",
    "Proximamente": "Próximamente",
    "Solo clientes calificados": "Solo clientes calificados",
    "En estructuracion": "En estructuración",
    "Derivada a aliado": "Derivada a aliado",
    "Abierta": "Abierta",
    "Cerrada": "Cerrada"
  };
  return map[status] ?? "En análisis";
}

function SectionTitle({ eyebrow, title, text, tone = "light" }: { eyebrow?: string; title: string; text?: string; tone?: "light" | "dark" }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9C7A3E]">{eyebrow}</p> : null}
      <h2 className={cn("mt-2 text-3xl font-bold md:text-4xl", tone === "dark" ? "text-white" : "text-[#0B1020]")}>{title}</h2>
      {text ? <p className={cn("mt-3 text-sm leading-7 md:text-base", tone === "dark" ? "text-[#C9D2DF]" : "text-[#475467]")}>{text}</p> : null}
    </div>
  );
}

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value));
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="grid grid-cols-[104px_1fr_44px] items-center gap-3 text-sm">
          <span className="truncate text-[#667085]">{item.label}</span>
          <div className="h-3 overflow-hidden rounded-sm bg-[#EEF0F3]">
            <div className="h-full rounded-sm bg-[#07111F]" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="font-semibold text-[#07111F]">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}

function Donut() {
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[150px_1fr]">
      <div className="relative h-[150px] w-[150px] rounded-full bg-[conic-gradient(#07111F_0_42%,#BFA46A_42%_66%,#9C7A3E_66%_84%,#DED6C7_84%_100%)]">
        <div className="absolute inset-7 grid place-items-center rounded-full bg-[#FCFAF7] text-center text-sm font-bold text-[#07111F]">Portfolio</div>
      </div>
      <div className="space-y-2 text-sm text-[#475467]">
        {["Mercado de valores 42%", "Real estate 24%", "Deuda privada 18%", "Liquidez 16%"].map((item) => (
          <div key={item} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#BFA46A]" />{item}</div>
        ))}
      </div>
    </div>
  );
}

function CountrySelector({ country, onChange }: { country: CountryCode; onChange: (country: CountryCode) => void }) {
  return (
    <div className="flex rounded-md border border-[#DED6C7]/25 bg-[#0B1322] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      {(Object.keys(countryConfig) as CountryCode[]).map((code) => (
        <button key={code} onClick={() => onChange(code)} className={cn("rounded px-2 py-1.5 text-xs font-bold transition sm:px-2.5 sm:text-sm", country === code ? "bg-[#BFA46A] text-[#07111F]" : "text-[#A8B2C2] hover:text-white")}>
          {countryConfig[code].flag}
        </button>
      ))}
    </div>
  );
}

function PartnerBadge({ partner }: { partner: string }) {
  return <Badge variant="outline" className="border-[#DED6C7] bg-[#FCFAF7] text-[#475467]">{partner}</Badge>;
}

function OperationalDisclaimer({ country, deal }: { country: CountryCode; deal?: Opportunity }) {
  const dealDisclaimer = deal ? "BINV Capital no ejecuta la operación desde esta plataforma. La ejecución, documentación final, custodia y liquidación dependen del aliado operativo, mercado, custodio o vehículo correspondiente." : null;
  const items = dealDisclaimer ? [dealDisclaimer, ...legalDisclaimersByCountry[country]] : legalDisclaimersByCountry[country];
  return <div className="rounded-md border border-[#BFA46A]/40 bg-[#F8F0DD] p-4 text-sm leading-6 text-[#5A431C]">{items.map((item) => <p key={item}>• {item}</p>)}</div>;
}

function DealCard({ deal, onDeal }: { deal: Opportunity; onDeal: (deal: Opportunity) => void }) {
  return (
    <Card className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)] transition hover:border-[#BFA46A]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <PartnerBadge partner={deal.operatingPartner} />
          <Badge variant="outline" className={riskStyles[deal.risk]}>{deal.risk}</Badge>
          <Badge variant="outline">{deal.status}</Badge>
        </div>
        <CardTitle>{deal.name}</CardTitle>
        <CardDescription>{deal.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-2 md:grid-cols-3">
          <InfoPill label="Ticket mínimo" value={money(deal.ticket, deal.currency)} />
          <InfoPill label="Retorno objetivo" value={deal.targetReturn} />
          <InfoPill label="Plazo" value={deal.term} />
        </div>
        <div className="rounded-md border border-[#DED6C7] bg-[#F4EFE7] p-3 text-[#475467]">
          <p><strong>Operación canalizada vía:</strong> {deal.operatingPartner}</p>
          <p><strong>BINV actúa como:</strong> {deal.binvRole}</p>
          <p><strong>Estado de derivación:</strong> {deal.referralStatus}</p>
        </div>
        <Button size="sm" onClick={() => onDeal(deal)}>Ver deal <ArrowRight className="h-4 w-4" /></Button>
      </CardContent>
    </Card>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-[#F4EFE7] p-3"><p className="text-xs font-semibold uppercase text-[#667085]">{label}</p><strong className="text-[#0B1020]">{value}</strong></div>;
}

function OpportunityTable({ opportunities, onDeal }: { opportunities: Opportunity[]; onDeal: (deal: Opportunity) => void }) {
  return (
    <div className="overflow-hidden rounded-md border border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]">
      <div className="hidden grid-cols-[1.15fr_0.48fr_0.78fr_0.82fr_0.7fr_0.7fr_0.55fr_0.62fr_0.7fr_0.58fr] gap-3 border-b border-[#DED6C7] bg-[#EEF0F3] p-3 text-xs font-bold uppercase text-[#667085] xl:grid">
        {["Nombre", "País", "Activo", "Aliado operativo", "Ticket", "Retorno", "Plazo", "Riesgo", "Estado", "Acción"].map((h) => <span key={h}>{h}</span>)}
      </div>
      {opportunities.length === 0 ? (
        <div className="p-8 text-sm text-[#667085]">No hay oportunidades para los filtros seleccionados.</div>
      ) : opportunities.map((deal) => (
        <div key={deal.id} className="grid gap-3 border-b border-[#DED6C7] p-4 text-sm last:border-b-0 xl:grid-cols-[1.15fr_0.48fr_0.78fr_0.82fr_0.7fr_0.7fr_0.55fr_0.62fr_0.7fr_0.58fr] xl:items-center">
          <strong>{deal.name}</strong><span>{deal.country}</span><span>{deal.assetType}</span><span>{deal.operatingPartner}</span><span>{money(deal.ticket, deal.currency)}</span><span>{deal.targetReturn}</span><span>{deal.term}</span><Badge variant="outline" className={riskStyles[deal.risk]}>{deal.risk}</Badge><Badge variant="outline">{deal.status}</Badge><Button size="sm" onClick={() => onDeal(deal)}>Ver deal</Button>
          <p className="text-xs text-[#667085] xl:col-span-10">Operación canalizada vía: {deal.operatingPartner}. BINV actúa como: {deal.binvRole}.</p>
        </div>
      ))}
    </div>
  );
}

function PublicLanding({ onAccess }: { onAccess: (user: DemoUser) => void }) {
  const [country, setCountry] = useState<CountryCode>("PE");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("binv-country") as CountryCode | null;
    if (stored === "PE" || stored === "AR") setCountry(stored);
  }, []);

  function changeCountry(next: CountryCode) {
    setCountry(next);
    window.localStorage.setItem("binv-country", next);
  }

  function enterPrivateExperience(user: DemoUser) {
    window.localStorage.setItem("binv-country", country);
    onAccess(user);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07111F] text-[#FCFAF7]">
      <PublicHeader country={country} onCountryChange={changeCountry} onAccess={() => setShowLogin(true)} />
      <main>
        <section id="inicio" className="hero-luxury relative min-h-[980px] overflow-hidden px-4 pb-36 pt-28 md:min-h-screen md:px-8 md:pb-24 md:pt-32 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(191,164,106,0.16),transparent_34%),radial-gradient(circle_at_82%_28%,rgba(156,122,62,0.13),transparent_34%),radial-gradient(circle_at_66%_72%,rgba(26,42,67,0.54),transparent_38%),linear-gradient(180deg,#050D19_0%,#07111F_48%,#0B1728_100%)]" />
          <HeroCapitalNetwork country={country} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,13,25,0.98)_0%,rgba(5,13,25,0.90)_34%,rgba(5,13,25,0.50)_66%,rgba(5,13,25,0.70)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_38%_46%,transparent_0%,rgba(5,13,25,0.10)_36%,rgba(5,13,25,0.84)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#07111F] via-[#07111F]/76 to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full min-w-0 max-w-[1420px] items-center">
            <div className="w-full min-w-0 max-w-3xl">
              <div className="block max-w-[22rem] rounded-sm border border-[#BFA46A]/25 bg-[#BFA46A]/[0.10] px-3 py-1.5 text-left text-[11px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#E5D2A4] shadow-[0_18px_60px_-42px_rgba(191,164,106,0.85)] backdrop-blur-sm sm:inline-block sm:max-w-full">
                Mercado de capitales · Real estate estructurado · Financiamiento empresarial
              </div>
              <h1 className="mt-8 max-w-[22rem] text-[2.18rem] font-semibold leading-[1.06] text-white sm:max-w-none sm:text-5xl md:mt-10 md:text-6xl xl:text-7xl">
                Capital estratégico para clientes patrimoniales y empresas de alto valor.
              </h1>
              <p className="mt-6 max-w-[22rem] text-base leading-8 text-[#C9D2DF] sm:max-w-2xl md:mt-8 md:text-lg">
                BINV Capital conecta oportunidades de inversión y financiamiento en Argentina y Perú, integrando mercado de capitales, real estate, deuda privada y aliados estratégicos.
              </p>
              <p className="mt-5 max-w-[22rem] text-xs font-semibold uppercase tracking-[0.24em] text-[#CDB77E] sm:max-w-2xl md:mt-6">
                Donde el capital encuentra estructura, acceso y visión regional.
              </p>
              <div className="mt-9 flex max-w-[22rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap md:mt-12">
                <Button size="lg" variant="secondary" className="private-bank-button private-bank-button-gold w-full sm:w-auto" onClick={() => setShowLogin(true)}>Solicitar asesoría privada</Button>
                <Button size="lg" className="private-bank-button private-bank-button-light w-full sm:w-auto" onClick={() => setShowLogin(true)}>Explorar oportunidades</Button>
                <Button size="lg" variant="outline" className="private-bank-button private-bank-button-ghost w-full sm:w-auto" onClick={() => setShowLogin(true)}>Buscar financiamiento</Button>
              </div>
              <div className="mt-14 hidden max-w-2xl gap-3 sm:grid sm:grid-cols-3">
                {[
                  ["País activo", `${countryConfig[country].label} · ${countryConfig[country].baseCurrency}`],
                  ["Acceso", "Por perfil y documentación"],
                  ["Rol BINV", "Estructura, criterio y conexión"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-[#BFA46A]/18 bg-white/[0.045] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8793A5]">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-[#FCFAF7]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="landing-story">
          <LandingCapitalNetwork country={country} />
          <PublicPillars country={country} />
          <EcosystemSection country={country} />
          <FeaturedOpportunities country={country} onAccess={() => setShowLogin(true)} />
          <PublicFinancingSection country={country} onAccess={() => setShowLogin(true)} />
          <ProcessSection />
          <UrbaniaShowcase onAccess={() => setShowLogin(true)} />
          <PublicInvestorRelationsSection onAccess={() => setShowLogin(true)} />
          <ComplianceSection country={country} />
          <FinalCTA onAccess={() => setShowLogin(true)} />
        </div>
      </main>
      {showLogin ? <LoginModal onClose={() => setShowLogin(false)} onAccess={enterPrivateExperience} /> : null}
    </div>
  );
}

function PublicHeader({ country, onCountryChange, onAccess }: { country: CountryCode; onCountryChange: (country: CountryCode) => void; onAccess: () => void }) {
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: "Inicio", href: "#inicio" },
    { label: "Inversiones", href: "#inversiones" },
    { label: "Financiamiento", href: "#financiamiento" },
    { label: "Urbania Capital", href: "#urbania-capital" },
    { label: "Ecosistema", href: "#ecosistema" },
    { label: "Rel. Inversionistas", href: "#relacion-inversionistas" }
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-[auto_auto] items-center justify-between gap-3 rounded-sm border border-white/[0.075] bg-[#050D19]/[0.58] px-3 py-3.5 shadow-[0_24px_80px_-62px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl md:px-6 lg:grid-cols-[auto_1fr_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-[124px] place-items-center rounded-sm border border-white/[0.08] bg-white/[0.035] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:w-[156px]">
            <Image src="/images/binv/logo-white.png" alt="BINV Capital" width={172} height={48} className="h-8 w-auto object-contain" priority />
          </span>
        </div>
        <nav className="hidden min-w-0 items-center justify-center gap-7 text-[13px] font-semibold text-[#A8B2C2] lg:flex">
          {navItems.map((item) => <a key={item.href} href={item.href} className="transition duration-300 hover:text-[#E3CF9C]">{item.label}</a>)}
        </nav>
        <div className="hidden shrink-0 items-center justify-end gap-2 sm:flex">
          <CountrySelector country={country} onChange={onCountryChange} />
          <Button size="sm" variant="secondary" className="private-bank-button private-bank-button-gold hidden min-h-9 px-5 py-2 text-sm sm:inline-flex" onClick={onAccess}>Acceso</Button>
        </div>
        <button className="fixed right-5 top-7 z-[95] grid h-10 w-10 place-items-center rounded-sm border border-[#BFA46A]/40 bg-[#BFA46A] text-[#07111F] shadow-[0_16px_44px_-30px_rgba(191,164,106,0.9)] lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir navegación">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-[90] bg-[#050D19]/92 p-4 backdrop-blur-xl lg:hidden">
          <div className="rounded-sm border border-white/[0.10] bg-[#07111F] p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <Image src="/images/binv/logo-white.png" alt="BINV Capital" width={132} height={40} className="h-8 w-auto object-contain" />
              <button className="grid h-10 w-10 place-items-center rounded-sm border border-white/[0.12] text-white" onClick={() => setOpen(false)} aria-label="Cerrar navegación"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 rounded-sm border border-[#BFA46A]/20 bg-white/[0.04] p-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8B2C2]">Mercado</span>
              <CountrySelector country={country} onChange={onCountryChange} />
            </div>
            <nav className="mt-5 grid gap-2">
              {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-sm border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm font-semibold text-[#FCFAF7]">{item.label}</a>)}
            </nav>
            <Button className="mt-5 w-full" variant="secondary" onClick={() => { setOpen(false); onAccess(); }}>Acceso privado</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeroCapitalNetwork({ country }: { country: CountryCode }) {
  const cityLabel = country === "PE" ? "Lima · nuam · Real estate" : "Buenos Aires · BYMA · MAE/A3";
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const sceneEl = scene;
    let raf = 0;
    function move(event: PointerEvent) {
      if (window.innerWidth < 768) return;
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5).toFixed(4);
        const y = (event.clientY / window.innerHeight - 0.5).toFixed(4);
        sceneEl.style.setProperty("--mx", x);
        sceneEl.style.setProperty("--my", y);
      });
    }

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const canvasEl = canvas;
    const ctx = context;
    let frame = 0;
    let width = 0;
    let height = 0;
    let raf = 0;
    const particleCount = window.innerWidth < 768 ? 42 : 118;
    const particles = Array.from({ length: particleCount }, (_, index) => ({
      angle: (Math.PI * 2 * index) / particleCount + Math.random() * 0.35,
      radius: 140 + Math.random() * 660,
      depth: 0.18 + Math.random() * 0.95,
      speed: 0.00035 + Math.random() * 0.00055,
      drift: Math.random() * Math.PI * 2
    }));

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvasEl.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvasEl.width = Math.floor(width * ratio);
      canvasEl.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      const originX = width * 0.70;
      const originY = height * 0.53;
      const projected = particles.map((particle) => {
        const angle = particle.angle + frame * particle.speed;
        const perspective = 1.15 - particle.depth * 0.44;
        return {
          x: originX + Math.cos(angle) * particle.radius * perspective + Math.sin(frame * 0.006 + particle.drift) * 16,
          y: originY + Math.sin(angle * 0.72) * particle.radius * 0.42 * perspective,
          depth: particle.depth
        };
      });

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      projected.forEach((point, index) => {
        for (let next = index + 1; next < projected.length; next += 1) {
          const other = projected[next];
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 178) {
            const alpha = (1 - distance / 178) * 0.14;
            ctx.strokeStyle = `rgba(191, 164, 106, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      projected.forEach((point) => {
        const pulse = 0.55 + Math.sin(frame * 0.025 + point.depth * 5) * 0.22;
        ctx.fillStyle = `rgba(227, 207, 156, ${0.12 + pulse * 0.18})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.4 + point.depth * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      raf = window.requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [country]);

  return (
    <div ref={sceneRef} className="capital-scene pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="capital-layer-far absolute inset-0 opacity-80">
        <div className="absolute -left-[18%] top-[8%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(191,164,106,0.13),transparent_64%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[4%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle,rgba(35,49,74,0.42),transparent_68%)] blur-3xl" />
      </div>
      <canvas ref={canvasRef} className="capital-layer-foreground absolute inset-0 h-full w-full opacity-65" />
      <div className="capital-layer-far capital-depth-grid absolute -inset-x-24 bottom-[-22%] h-[76%] opacity-30 [background-image:linear-gradient(rgba(191,164,106,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(191,164,106,0.08)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="capital-layer-mid capital-depth-grid absolute -inset-x-24 bottom-[-34%] h-[54%] opacity-16 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:88px_88px]" />
      <div className="capital-layer-mid capital-drift absolute left-[44%] top-[12%] h-[58rem] w-[58rem] rounded-full border border-[#BFA46A]/[0.08]" />
      <div className="capital-layer-far capital-drift-reverse absolute right-[-14rem] top-[4rem] h-[46rem] w-[46rem] rounded-full border border-[#94A3B8]/[0.08]" />
      <div className="capital-layer-near capital-haze absolute inset-x-[12%] top-[34%] h-56 rounded-full bg-[radial-gradient(ellipse,rgba(191,164,106,0.10),transparent_68%)] blur-3xl" />
      <div className="capital-foreground-depth absolute inset-0">
        <span className="capital-soft-particle left-[8%] top-[24%] h-32 w-32 opacity-20" />
        <span className="capital-soft-particle left-[72%] top-[18%] h-44 w-44 opacity-18 [animation-delay:-6s]" />
        <span className="capital-soft-particle bottom-[14%] left-[58%] h-28 w-28 opacity-16 [animation-delay:-11s]" />
        <span className="capital-light-streak left-[18%] top-[38%] w-[42rem] rotate-[-16deg]" />
        <span className="capital-light-streak right-[-12%] top-[62%] w-[34rem] rotate-[-24deg] [animation-delay:-9s]" />
        <span className="capital-signal capital-signal-one" />
        <span className="capital-signal capital-signal-two" />
        <span className="capital-signal capital-signal-three" />
      </div>
      <svg className="capital-layer-mid capital-slow-pan absolute -inset-x-[10%] -top-[10%] h-[120%] w-[120%]" viewBox="0 0 1440 900" role="img" aria-label="Red abstracta de capital regional">
        <defs>
          <linearGradient id="flow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#BFA46A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C95B2B" stopOpacity="0.62" />
          </linearGradient>
          <linearGradient id="buildingGlow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#BFA46A" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.08" />
          </linearGradient>
          <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M70 650 C226 498 334 414 514 440 C696 468 744 238 958 206 C1108 182 1240 236 1374 330" fill="none" stroke="url(#flow)" strokeWidth="2.4" strokeDasharray="12 18" filter="url(#softGlow)" className="capital-flow-line" />
        <path d="M136 724 L344 578 L540 614 L764 462 L1114 504 L1350 430" fill="none" stroke="#BFA46A" strokeOpacity="0.32" strokeWidth="1.2" />
        <path d="M190 258 L372 178 L574 238 L810 138 L1088 186 L1340 126" fill="none" stroke="#94A3B8" strokeOpacity="0.22" strokeWidth="1" />
        <path d="M88 392 C238 298 390 274 550 312 C710 350 842 280 1038 326 C1180 360 1300 422 1430 498" fill="none" stroke="#BFA46A" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M58 802 C288 704 490 714 674 642 C848 574 1030 610 1370 540" fill="none" stroke="#94A3B8" strokeOpacity="0.14" strokeWidth="1" />
        <path d="M858 746 C930 636 1052 570 1212 580 C1304 586 1378 624 1432 690" fill="none" stroke="#BFA46A" strokeOpacity="0.18" strokeWidth="1" />
        <path d="M-40 590 C102 506 198 524 310 488 C456 442 548 348 682 378 C756 394 804 450 880 430 C980 404 1028 314 1138 302 C1266 288 1368 354 1488 318" fill="none" stroke="#E3CF9C" strokeOpacity="0.105" strokeWidth="1" strokeDasharray="3 18" className="capital-organic-line" />
        <path d="M-70 744 C118 660 270 692 418 610 C560 532 612 602 754 548 C888 498 990 528 1116 466 C1254 398 1374 448 1510 382" fill="none" stroke="#94A3B8" strokeOpacity="0.10" strokeWidth="1" strokeDasharray="2 14" className="capital-organic-line-reverse" />
        {[ [170,698], [344,578], [540,614], [764,462], [1114,504], [1298,438], [514,440], [958,206], [1088,186], [1220,580] ].map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={index % 2 ? 7 : 10} fill="#07111F" stroke="#BFA46A" strokeWidth="2" className={index % 3 === 0 ? "capital-pulse" : ""} />
            <circle cx={x} cy={y} r="2.5" fill="#E3CF9C" />
          </g>
        ))}
        <g opacity="0.88">
          <path d="M796 742 L796 636 L854 636 L854 742 M884 742 L884 596 L950 596 L950 742 M984 742 L984 664 L1042 664 L1042 742" fill="url(#buildingGlow)" stroke="#BFA46A" strokeOpacity="0.22" />
          <path d="M1082 688 L1082 590 L1140 590 L1140 688 M1178 688 L1178 548 L1248 548 L1248 688 M1284 688 L1284 616 L1342 616 L1342 688" fill="none" stroke="#94A3B8" strokeWidth="3" strokeOpacity="0.38" />
          <rect x="940" y="338" width="238" height="126" rx="6" fill="#111C31" fillOpacity="0.38" stroke="#BFA46A" strokeOpacity="0.20" />
          <path d="M982 424 L982 374 L1024 374 L1024 424 M1056 424 L1056 360 L1118 360 L1118 424" stroke="#BFA46A" strokeWidth="3" fill="none" strokeOpacity="0.58" />
          <rect x="214" y="478" width="190" height="112" rx="6" fill="#111C31" fillOpacity="0.24" stroke="#BFA46A" strokeOpacity="0.16" />
          <path d="M250 558 V502 M288 558 V486 M326 558 V516 M366 558 V498" stroke="#BFA46A" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.56" />
        </g>
        <g opacity="0.20">
          <path d="M140 128 L310 96 L482 150 L690 92 L910 142 L1160 96 L1390 128" fill="none" stroke="#BFA46A" strokeWidth="1" />
          <path d="M154 166 L324 132 L496 188 L704 130 L924 180 L1174 134 L1404 166" fill="none" stroke="#BFA46A" strokeWidth="1" />
          <path d="M168 204 L338 168 L510 226 L718 168 L938 218 L1188 172 L1418 204" fill="none" stroke="#BFA46A" strokeWidth="1" />
          <path d="M182 242 L352 204 L524 264 L732 206 L952 256 L1202 210 L1432 242" fill="none" stroke="#BFA46A" strokeWidth="1" />
        </g>
        <g opacity="0.18">
          <path d="M1040 248 C1094 204 1166 214 1208 270 C1260 338 1194 402 1120 388 C1052 376 1000 302 1040 248Z" fill="none" stroke="#E3CF9C" strokeWidth="1" />
          <path d="M118 620 C158 544 222 538 274 592 C328 648 280 732 200 718 C146 708 94 670 118 620Z" fill="none" stroke="#E3CF9C" strokeWidth="1" />
        </g>
        <g opacity="0.18" fontSize="9" fontFamily="Aptos, Segoe UI, sans-serif" letterSpacing="2">
          <text x="1180" y="132" fill="#CDB77E">REGIONAL SIGNAL 04</text>
          <text x="104" y="368" fill="#94A3B8">CAPITAL ROUTE / PRIVATE</text>
          <text x="970" y="712" fill="#94A3B8">INFRASTRUCTURE INDEX</text>
        </g>
      </svg>
      <div className="capital-layer-near absolute right-[6%] top-[18%] hidden rounded-sm border border-[#BFA46A]/[0.16] bg-[#07111F]/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#BFA46A]">Mercado activo</p>
        <p className="mt-1 text-sm font-semibold text-[#FCFAF7]">{cityLabel}</p>
      </div>
      <div className="capital-layer-near absolute right-[9%] top-[36%] hidden w-72 space-y-2 text-[10px] uppercase tracking-[0.18em] text-[#7F8A9D] xl:block">
        {["BINV / LATAM / CAPITAL MAP", "PE-AR FLOW INDEX 07.42", "REAL ASSET SIGNAL / ACTIVE"].map((item) => (
          <div key={item} className="border-b border-white/[0.08] pb-2">{item}</div>
        ))}
      </div>
      <div className="capital-layer-near absolute bottom-[15%] right-[10%] hidden grid-cols-3 gap-2 lg:grid">
        {["Capital", "Real estate", "Financing"].map((item) => (
          <div key={item} className="rounded-sm border border-[#BFA46A]/[0.14] bg-white/[0.035] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#A8B2C2] backdrop-blur-sm">{item}</div>
        ))}
      </div>
    </div>
  );
}

function LandingCapitalNetwork({ country }: { country: CountryCode }) {
  const networkRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = networkRef.current;
    if (!node) return;

    const network = node;
    let raf = 0;
    function update() {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const rect = network.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
        network.style.setProperty("--scroll-progress", progress.toFixed(4));
        network.style.setProperty("--network-flow-x", `${(-34 * progress).toFixed(2)}px`);
        network.style.setProperty("--network-flow-y", `${(-110 * progress).toFixed(2)}px`);
        network.style.setProperty("--network-grid-far-x", `${(-46 * progress).toFixed(2)}px`);
        network.style.setProperty("--network-grid-far-y", `${(24 * progress).toFixed(2)}px`);
        network.style.setProperty("--network-grid-near-x", `${(70 * progress).toFixed(2)}px`);
        network.style.setProperty("--network-grid-near-y", `${(-20 * progress).toFixed(2)}px`);
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const countryLabel = country === "PE" ? "LIMA / NUAM / URBANIA" : "BUENOS AIRES / BYMA / MAE";

  return (
    <div ref={networkRef} className="landing-capital-network" aria-hidden="true">
      <div className="landing-network-sticky">
        <div className="landing-network-gradient" />
        <div className="landing-network-grid landing-network-grid-far" />
        <div className="landing-network-grid landing-network-grid-near" />
        <svg className="landing-network-svg" viewBox="0 0 1440 1800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="landingFlow" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#BFA46A" stopOpacity="0.34" />
              <stop offset="52%" stopColor="#9C7A3E" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0.12" />
            </linearGradient>
            <filter id="landingGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path className="landing-network-flow" d="M-120 160 C180 240 260 430 520 418 C760 406 792 650 1030 698 C1220 736 1338 898 1510 990" fill="none" stroke="url(#landingFlow)" strokeWidth="1.6" strokeDasharray="10 24" filter="url(#landingGlow)" />
          <path className="landing-network-flow landing-network-flow-alt" d="M-80 740 C140 650 312 760 500 878 C690 998 870 926 1010 1108 C1156 1296 1318 1320 1520 1458" fill="none" stroke="#BFA46A" strokeOpacity="0.18" strokeWidth="1.2" strokeDasharray="4 18" />
          <path d="M72 340 L280 256 L522 346 L754 230 L1010 326 L1306 270" fill="none" stroke="#07111F" strokeOpacity="0.08" />
          <path d="M92 1210 L306 1086 L538 1168 L772 1010 L1018 1114 L1374 1048" fill="none" stroke="#07111F" strokeOpacity="0.08" />
          {[ [230, 278], [520, 418], [790, 650], [1030, 698], [390, 820], [500, 878], [870, 926], [1010, 1108], [1220, 1310] ].map(([x, y], index) => (
            <g key={`${x}-${y}`} className="landing-network-node" style={{ animationDelay: `${index * -0.8}s` }}>
              <circle cx={x} cy={y} r={index % 2 ? 5 : 7} fill="#F4EFE7" stroke="#BFA46A" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="1.8" fill="#7A6032" />
            </g>
          ))}
          <g className="landing-network-architecture">
            <path d="M906 510 V438 H954 V510 M988 510 V406 H1054 V510 M1092 510 V454 H1140 V510" fill="none" stroke="#9C7A3E" strokeOpacity="0.18" strokeWidth="2" />
            <path d="M210 1420 V1328 H272 V1420 M318 1420 V1288 H396 V1420 M438 1420 V1352 H500 V1420" fill="none" stroke="#9C7A3E" strokeOpacity="0.16" strokeWidth="2" />
          </g>
          <text x="1040" y="210" className="landing-network-label">{countryLabel}</text>
          <text x="126" y="1012" className="landing-network-label">CAPITAL MARKETS / REAL ASSETS / FINANCING</text>
        </svg>
      </div>
    </div>
  );
}

function PublicPillars({ country }: { country: CountryCode }) {
  const config = countryConfig[country];
  const pillars = [
    ["Inversiones", "Oportunidades seleccionadas en mercado de capitales, renta fija, deuda privada, real estate e instrumentos internacionales mediante aliados operativos.", Landmark],
    ["Financiamiento", "Estructuración y derivación de soluciones de financiamiento para empresas mediante aliados, mercado de capitales y estructuras privadas.", Banknote],
    ["Real Estate / Urbania Capital", config.urbaniaPositioning, Building2]
  ] as const;
  return <section id="inversiones" className="landing-ecosystem bg-[#F4EFE7] px-4 py-24 md:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Tres pilares" title="Estructura, acceso y criterio para decisiones de alto valor." text="El primer contacto no es con una app operativa: es con una firma que ordena, filtra y conecta oportunidades." /><div className="mt-10 grid gap-5 lg:grid-cols-3">{pillars.map(([title, text, Icon]) => <Card key={title} className="rounded-md border-[#DED6C7] bg-[#FCFAF7]"><CardHeader><Icon className="h-6 w-6 text-[#9C7A3E]" /><CardTitle>{title}</CardTitle><CardDescription>{text}</CardDescription></CardHeader></Card>)}</div></div></section>;
}

function EcosystemSection({ country }: { country: CountryCode }) {
  return <section id="ecosistema" className="landing-ecosystem bg-[#FCFAF7] px-4 py-24 md:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Ecosistema regional" title="Aliados, infraestructura y verticales claramente diferenciadas." text="BINV distingue aliados operativos, referencias de mercado, custodia internacional y verticales propias." /><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{partnersByCountry[country].map((partner) => <Card key={partner.name} className="rounded-md border-[#DED6C7] bg-[#FCFAF7]"><CardHeader><Badge variant="outline" className="w-fit border-[#BFA46A]/35 bg-[#BFA46A]/10 text-[#7A6032]">{partner.category}</Badge><CardTitle>{partner.name}</CardTitle><CardDescription>{partner.role}</CardDescription></CardHeader></Card>)}</div></div></section>;
}

function FeaturedOpportunities({ country, onAccess }: { country: CountryCode; onAccess: () => void }) {
  const featured = getVisibleOpportunities(country).slice(0, 3);
  return <section className="landing-ecosystem bg-[#F4EFE7] px-4 py-24 md:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Oportunidades destacadas" title="Vista pública, sin información sensible." text="El acceso completo a data rooms depende de perfil, KYC/KYB y documentación." /><div className="mt-10 grid gap-5 lg:grid-cols-3">{featured.map((deal) => <Card key={deal.id} className="rounded-md border-[#DED6C7] bg-[#FCFAF7]"><CardHeader><PartnerBadge partner={deal.operatingPartner} /><CardTitle>{deal.name}</CardTitle><CardDescription>{deal.summary}</CardDescription></CardHeader><CardContent className="space-y-3"><InfoPill label="Activo" value={deal.assetType} /><InfoPill label="País" value={deal.country} /><Button className="w-full" onClick={onAccess}>Solicitar acceso</Button></CardContent></Card>)}</div></div></section>;
}

function PublicFinancingSection({ country, onAccess }: { country: CountryCode; onAccess: () => void }) {
  const config = countryConfig[country];
  const instruments = financingInstrumentsByCountry[country].slice(0, 6);
  return (
    <section id="financiamiento" className="landing-ecosystem bg-[#FCFAF7] px-4 py-24 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <SectionTitle eyebrow="Financiamiento empresarial" title="Originación y estructuración para compañías que buscan capital." text={config.financingIntro} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" className="private-bank-button private-bank-button-gold" onClick={onAccess}>Iniciar evaluación</Button>
            <Button variant="outline" onClick={onAccess}>Hablar con un asesor</Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {instruments.map((item) => (
            <div key={item} className="rounded-md border border-[#DED6C7] bg-[#F4EFE7] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9C7A3E]">{countryConfig[country].label}</p>
              <p className="mt-3 text-sm font-bold text-[#07111F]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = ["Diagnóstico", "Perfilamiento", "Validación KYC/KYB", "Acceso a oportunidades", "Derivación a aliado", "Seguimiento informativo"];
  return <section className="landing-ecosystem bg-[#FCFAF7] px-4 py-24 md:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Proceso" title="Una ruta institucional antes de acceder a oportunidades." /><div className="mt-10 grid gap-3 md:grid-cols-3 lg:grid-cols-6">{steps.map((step, index) => <div key={step} className="rounded-md border border-[#DED6C7] bg-[#F4EFE7] p-4"><p className="text-sm font-bold text-[#9C7A3E]">0{index + 1}</p><p className="mt-3 text-sm font-semibold text-[#0B1020]">{step}</p></div>)}</div></div></section>;
}

function UrbaniaShowcase({ onAccess }: { onAccess: () => void }) {
  return <section id="urbania-capital" className="landing-ecosystem bg-[#07111F] px-4 py-24 text-white md:px-8 lg:px-12"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr]"><div><SectionTitle tone="dark" eyebrow="Urbania Capital" title="Real estate con lógica institucional." text="Urbania Capital integra activos inmobiliarios, estructura legal y seguimiento de proyectos para clientes que buscan exposición a real estate con una lógica más institucional." /><p className="mt-5 text-sm leading-7 text-[#A8B2C2]">Los proyectos se ejecutan principalmente en Perú y pueden estar disponibles para clientes de Perú y Argentina según perfil, documentación y condiciones aplicables.</p><Button className="mt-9 rounded-sm shadow-[0_18px_55px_-32px_rgba(191,164,106,0.9)]" variant="secondary" onClick={onAccess}>Solicitar evaluación privada</Button></div><div className="grid gap-4 md:grid-cols-3">{urbaniaProjects.map((project) => <div key={project.name} className="rounded-md border border-[#BFA46A]/18 bg-white/[0.055] p-4"><Badge variant="outline" className="border-[#BFA46A]/30 bg-[#BFA46A]/10 text-[#E3CF9C]">Ejecutado en Perú</Badge><p className="mt-4 text-sm font-bold text-white">{project.name}</p><p className="mt-2 text-xs text-[#A8B2C2]">{project.location}</p><p className="mt-4 text-xs text-[#BFA46A]">{project.structure}</p></div>)}</div></div></section>;
}

function PublicInvestorRelationsSection({ onAccess }: { onAccess: () => void }) {
  return (
    <section id="relacion-inversionistas" className="landing-ecosystem bg-[#F4EFE7] px-4 py-24 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionTitle eyebrow="Relación con Inversionistas" title="Reportes, comunicados y documentación institucional en un entorno privado." text="La información sensible se organiza por país, perfil, estado KYC/KYB y permisos de acceso." />
        <div className="grid gap-4 md:grid-cols-3">
          {["Reportes", "Comunicados", "Documentos legales"].map((item) => (
            <Card key={item} className="rounded-md border-[#DED6C7] bg-[#FCFAF7]">
              <CardHeader><FileText className="h-5 w-5 text-[#9C7A3E]" /><CardTitle>{item}</CardTitle><CardDescription>Acceso según perfil y país activo.</CardDescription></CardHeader>
            </Card>
          ))}
        </div>
        <Button className="w-fit" variant="secondary" onClick={onAccess}>Solicitar acceso institucional</Button>
      </div>
    </section>
  );
}

function ComplianceSection({ country }: { country: CountryCode }) {
  return <section className="landing-ecosystem bg-[#F4EFE7] px-4 py-20 md:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Confianza y compliance" title="Acceso privado, documentación y aliados autorizados." /><div className="mt-8 grid gap-3 md:grid-cols-2">{legalDisclaimersByCountry[country].slice(0, 4).map((item) => <div key={item} className="rounded-md border border-[#DED6C7] bg-[#FCFAF7] p-4 text-sm leading-6 text-[#475467]">{item}</div>)}</div></div></section>;
}

function FinalCTA({ onAccess }: { onAccess: () => void }) {
  return <section className="landing-ecosystem bg-[#FCFAF7] px-4 py-24 md:px-8 lg:px-12"><div className="mx-auto max-w-4xl rounded-md border border-[#DED6C7] bg-[#07111F] p-8 text-center text-white shadow-[0_32px_100px_-70px_rgba(11,16,32,0.95)] md:p-12"><p className="text-sm uppercase tracking-[0.22em] text-[#BFA46A]">Evaluación privada</p><h2 className="mt-5 text-3xl font-bold md:text-5xl">No todos los clientes necesitan más productos. Algunos necesitan mejor estructura.</h2><Button className="mt-10 rounded-sm shadow-[0_18px_55px_-32px_rgba(191,164,106,0.9)]" variant="secondary" size="lg" onClick={onAccess}>Solicitar evaluación privada</Button></div></section>;
}

function LoginModal({ onClose, onAccess }: { onClose: () => void; onAccess: (user: DemoUser) => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#07111F]/80 p-4 backdrop-blur">
      <div className="w-full max-w-2xl rounded-md border border-[#DED6C7] bg-[#FCFAF7] p-6 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.8)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1020]">Acceso privado</h2>
            <p className="mt-2 text-sm leading-6 text-[#475467]">Selecciona un perfil demo. Cada rol activa una experiencia, permisos y estado KYC/KYB distintos.</p>
          </div>
          <button onClick={onClose} className="rounded-md border border-[#DED6C7] px-2 py-1 text-sm">Cerrar</button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {demoUsers.map((user) => (
            <button key={user.role} onClick={() => onAccess(user)} className="rounded-md border border-[#DED6C7] bg-[#F4EFE7] p-4 text-left transition hover:border-[#BFA46A] hover:bg-[#FCFAF7]">
              <p className="text-sm font-bold text-[#07111F]">{user.name}</p>
              <p className="mt-1 text-xs text-[#667085]">{user.role} · KYC {user.kyc} · {user.profile}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BinvCapitalPlatform() {
  const [user, setUser] = useState<DemoUser | null>(null);

  if (!user) {
    return <PublicLanding onAccess={setUser} />;
  }

  return <PrivatePlatform user={user} onLogout={() => setUser(null)} />;
}

function PrivatePlatform({ user, onLogout }: { user: DemoUser; onLogout: () => void }) {
  const [country, setCountry] = useState<CountryCode>("PE");
  const [view, setView] = useState<View>(roleHomeView(user.role));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [apiOpportunities, setApiOpportunities] = useState<Opportunity[] | null>(null);
  const [opportunitiesApiStatus, setOpportunitiesApiStatus] = useState<"loading" | "connected" | "fallback">("loading");
  const [selectedDeal, setSelectedDeal] = useState<Opportunity>(getVisibleOpportunities("PE")[0]);
  const [asset, setAsset] = useState("Todos");
  const [partner, setPartner] = useState("Todos");
  const [risk, setRisk] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [currency, setCurrency] = useState("Todos");
  const [ticket, setTicket] = useState("Todos");
  const [term, setTerm] = useState("Todos");
  const [countryFilter, setCountryFilter] = useState("Activo");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("binv-country") as CountryCode | null;
    if (stored === "PE" || stored === "AR") {
      setCountry(stored);
      setSelectedDeal(getVisibleOpportunities(stored)[0]);
    }
  }, []);

  function changeCountry(next: CountryCode) {
    setCountry(next);
    setSelectedDeal(getVisibleOpportunities(next)[0]);
    setOpportunitiesApiStatus("loading");
    window.localStorage.setItem("binv-country", next);
  }

  useEffect(() => {
    const controller = new AbortController();
    setOpportunitiesApiStatus("loading");

    fetch(`/api/binv/opportunities?country=${country}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("No se pudo cargar oportunidades")))
      .then((payload: { data: ApiOpportunity[] }) => {
        const next = mergeApiOpportunities(country, payload.data);
        setApiOpportunities(next);
        setOpportunitiesApiStatus("connected");
        setSelectedDeal((current) => next.find((deal) => deal.id === current.id) ?? next[0]);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setApiOpportunities(null);
        setOpportunitiesApiStatus("fallback");
      });

    return () => controller.abort();
  }, [country]);

  const opportunitySource = apiOpportunities ?? getVisibleOpportunities(country);

  const visibleOpportunities = useMemo(() => {
    return opportunitySource.filter((deal) => {
      const countryMatch = countryFilter === "Activo" ? true : countryFilter === "Todos" ? true : deal.country === countryFilter;
      const assetMatch = asset === "Todos" || deal.assetType === asset;
      const partnerMatch = partner === "Todos" || deal.operatingPartner === partner;
      const riskMatch = risk === "Todos" || deal.risk === risk;
      const statusMatch = status === "Todos" || deal.status === status;
      const currencyMatch = currency === "Todos" || deal.currency === currency;
      const ticketMatch = ticket === "Todos" || (ticket === "50k+" ? deal.ticket >= 50000 : deal.ticket >= 100000);
      const termMatch = term === "Todos" || (term === "Corto" ? deal.term.includes("30-") || deal.term.includes("6-") || deal.term.includes("12-18") : !deal.term.includes("30-"));
      const queryMatch = `${deal.name} ${deal.operatingPartner} ${deal.assetType} ${deal.marketReference}`.toLowerCase().includes(query.toLowerCase());
      return countryMatch && assetMatch && partnerMatch && riskMatch && statusMatch && currencyMatch && ticketMatch && termMatch && queryMatch;
    });
  }, [asset, countryFilter, currency, opportunitySource, partner, query, risk, status, term, ticket]);

  const partnerOptions = Array.from(new Set(opportunitySource.map((deal) => deal.operatingPartner)));
  const navGroups: { label: string; items: { id: View; label: string; icon: typeof BarChart3 }[] }[] = [
    { label: "Principal", items: [{ id: "home", label: "Inicio institucional", icon: Landmark }, { id: "dashboard", label: "Dashboard", icon: BarChart3 }] },
    { label: "Inversiones", items: [{ id: "investments", label: "Investment Hub", icon: Landmark }, { id: "deal", label: "Deal Room", icon: FileText }, { id: "portfolio", label: "Portfolio", icon: PieChart }] },
    { label: "Servicios", items: [{ id: "financing", label: "Financing Hub", icon: Banknote }, { id: "urbania", label: "Urbania Capital", icon: Building2 }] },
    { label: "Institucional", items: [{ id: "partners", label: "Aliados", icon: Handshake }, { id: "investors", label: "Rel. Inversionistas", icon: FileText }, { id: "legal", label: "Legal", icon: ShieldCheck }, { id: "faq", label: "FAQ", icon: Bell }] },
    { label: "Operación", items: [{ id: "profile", label: "Perfil del cliente", icon: UserRoundCheck }, { id: "kyc", label: "KYC / KYB", icon: BadgeCheck }, { id: "admin", label: "Panel Admin", icon: ShieldCheck }] }
  ];
  const pageTitles: Record<View, string> = {
    home: "Inicio · BINV Capital",
    dashboard: "Dashboard · Vista patrimonial",
    investments: "Investment Hub · Oportunidades",
    deal: "Deal Room · Evaluación",
    portfolio: "Portfolio · Posiciones informativas",
    urbania: "Urbania Capital · Real estate",
    financing: "Financing Hub · Empresas",
    investors: "Relación con Inversionistas",
    admin: "Panel Admin",
    login: "Acceso de clientes",
    profile: "Perfil del cliente",
    kyc: "KYC / KYB",
    partners: "Aliados e infraestructura",
    legal: "Legal / Disclaimers",
    faq: "FAQ"
  };
  const visibleNavGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => user.role === "Admin BINV" || item.id !== "admin")
  })).filter((group) => group.items.length > 0);

  function navigate(next: View) {
    setView(next);
    setMobileNavOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F4EFE7] text-[#0B1020]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[236px] flex-col border-r border-[#BFA46A]/20 bg-[#07111F] lg:flex">
        <button onClick={() => navigate("home")} className="border-b border-[#BFA46A]/20 px-4 py-5 text-left">
          <span className="grid h-12 w-[168px] place-items-center overflow-hidden rounded-md border border-white/10 bg-[#0B1322] px-3 shadow-[0_12px_34px_-22px_rgba(191,164,106,0.55)]">
            <Image src="/images/binv/logo-white.png" alt="BINV Capital" width={172} height={48} className="h-8 w-auto object-contain" priority />
          </span>
          <span className="mt-2 block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#667085]">Capital · Plataforma patrimonial</span>
        </button>
        <div className="border-b border-[#BFA46A]/20 px-4 py-3">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#667085]">Mercado activo</p>
          <CountrySelector country={country} onChange={changeCountry} />
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {visibleNavGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="px-4 pb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#667085]">{group.label}</p>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => navigate(id)} className={cn("flex w-full items-center gap-2 border-l-2 border-transparent px-4 py-2 text-left text-xs font-semibold text-[#9AA6B8] transition hover:bg-[#BFA46A]/[0.08] hover:text-[#F4EFE7]", view === id && "border-[#BFA46A] bg-[#BFA46A]/[0.12] text-[#E3CF9C]")}>
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-[#BFA46A]/20 p-4">
          <div className="rounded-md border border-[#027A48]/35 bg-[#027A48]/12 px-3 py-2 text-xs font-semibold text-emerald-300">
            {user.kyc === "Aprobado" ? "KYC aprobado" : `KYC ${user.kyc}`} · {user.profile}
          </div>
        </div>
      </aside>

      <div className="lg:ml-[236px]">
        <header className="sticky top-0 z-40 border-b border-[#DED6C7] bg-[#FCFAF7]/95 shadow-[0_18px_46px_-38px_rgba(11,16,32,0.55)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-6">
            <div className="min-w-0">
              <button className="mb-2 inline-flex items-center gap-2 rounded-sm border border-[#DED6C7] bg-white px-2 py-1 text-xs font-semibold text-[#07111F] lg:hidden" onClick={() => setMobileNavOpen(true)}><Menu className="h-4 w-4" /> Menú</button>
              <p className="text-base font-semibold text-[#0B1020]">{pageTitles[view]}</p>
              <p className="text-[11px] text-[#667085]">{countryConfig[country].context}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-[#BFA46A]/40 bg-[#F4EFE7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A6032] md:inline-flex">{countryConfig[country].label} · {countryConfig[country].baseCurrency}</span>
              <div className="lg:hidden"><CountrySelector country={country} onChange={changeCountry} /></div>
              <Button size="sm" variant="secondary" onClick={() => navigate("profile")}><LogIn className="h-4 w-4" />{user.role}</Button>
            </div>
          </div>
        </header>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-[70] bg-[#07111F]/88 p-4 backdrop-blur-xl lg:hidden">
            <div className="max-h-[92vh] overflow-y-auto rounded-md border border-[#DED6C7]/20 bg-[#FCFAF7] p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#07111F]">{user.name}</p>
                  <p className="text-xs text-[#667085]">{user.role} · KYC {user.kyc}</p>
                </div>
                <button className="grid h-10 w-10 place-items-center rounded-sm border" onClick={() => setMobileNavOpen(false)} aria-label="Cerrar menú"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-4"><CountrySelector country={country} onChange={changeCountry} /></div>
              <nav className="mt-5 grid gap-4">
                {visibleNavGroups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9C7A3E]">{group.label}</p>
                    <div className="grid gap-2">
                      {group.items.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => navigate(id)} className={cn("flex items-center gap-2 rounded-sm border border-[#DED6C7] bg-[#F4EFE7] px-3 py-3 text-left text-sm font-semibold", view === id && "border-[#BFA46A] bg-[#07111F] text-white")}>
                          <Icon className="h-4 w-4" />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
              <Button className="mt-5 w-full" variant="outline" onClick={onLogout}>Salir del demo</Button>
            </div>
          </div>
        ) : null}

        <main className="mx-auto max-w-[1360px] space-y-6 px-4 py-7 lg:px-8">
          {view === "home" && <Home country={country} user={user} setView={navigate} />}
          {view === "dashboard" && <Dashboard country={country} user={user} />}
          {view === "investments" && (
            <InvestmentHub
              opportunities={visibleOpportunities}
              filters={{ asset, partner, risk, status, currency, ticket, term, countryFilter, query }}
              options={{ partnerOptions }}
              apiStatus={opportunitiesApiStatus}
              setters={{ setAsset, setPartner, setRisk, setStatus, setCurrency, setTicket, setTerm, setCountryFilter, setQuery }}
              onDeal={(deal) => {
                setSelectedDeal(deal);
                setView("deal");
              }}
            />
          )}
          {view === "deal" && <DealRoom country={country} deal={selectedDeal} user={user} />}
          {view === "portfolio" && <Portfolio country={country} />}
          {view === "urbania" && <Urbania country={country} />}
          {view === "financing" && <FinancingHub country={country} user={user} />}
          {view === "investors" && <InvestorRelations country={country} />}
          {view === "admin" && <AdminPanel country={country} />}
          {view === "login" && <Login />}
          {view === "profile" && <Profile country={country} user={user} onLogout={onLogout} />}
          {view === "kyc" && <Kyc country={country} user={user} />}
          {view === "partners" && <Partners country={country} />}
          {view === "legal" && <Legal country={country} />}
          {view === "faq" && <Faq country={country} />}
        </main>
      </div>
    </div>
  );
}

function Home({ country, user, setView }: { country: CountryCode; user: DemoUser; setView: (view: View) => void }) {
  const config = countryConfig[country];
  return (
    <>
      <section className="relative overflow-hidden rounded-md bg-[#07111F] px-6 py-12 text-white shadow-[0_32px_90px_-62px_rgba(7,17,31,0.95)] md:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(191,164,106,0.18),transparent_32%),linear-gradient(90deg,rgba(7,17,31,0.98),rgba(11,19,34,0.92))]" />
        <div className="absolute right-[-120px] top-[-150px] h-[360px] w-[360px] rounded-full border border-[#BFA46A]/10" />
        <div className="absolute bottom-[-180px] right-[80px] h-[420px] w-[420px] rounded-full bg-[#BFA46A]/[0.035]" />
        <div className="relative max-w-4xl">
          <Badge className="bg-[#BFA46A] text-[#07111F]">{user.role} · {user.profile} · KYC {user.kyc}</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] text-white md:text-7xl">BINV Capital</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-white/80">
            BINV Capital conecta clientes patrimoniales, empresas e inversores calificados con oportunidades de inversión y financiamiento en Argentina y Perú, integrando mercado de capitales, real estate, deuda privada y aliados estratégicos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" onClick={() => setView("investments")}>Explorar oportunidades <ArrowRight className="h-4 w-4" /></Button>
            <Button size="lg" className="bg-[#FCFAF7] text-[#07111F] hover:bg-[#F4EFE7]" onClick={() => setView("profile")}>Solicitar asesoría</Button>
            <Button size="lg" variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => setView("financing")}>Buscar financiamiento</Button>
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <InfoList title="Próximas acciones" items={[user.kyc === "Aprobado" ? "Puedes solicitar acceso a data rooms habilitados para tu perfil." : "Completa KYC/KYB antes de acceder a documentación sensible.", config.nextAction, user.role === "Empresa solicitante" ? "Completa la solicitud de financiamiento para prediagnóstico." : "Revisar oportunidades recomendadas por país activo."]} icon={Bell} />
        <InfoList title="Perfil operativo" items={[`Rol: ${user.role}`, `Perfil: ${user.profile}`, `KYC: ${user.kyc}`, `KYB: ${user.kyb}`, `Mercado activo: ${config.label}`]} icon={UserRoundCheck} />
        <InfoList title="Accesos disponibles" items={["Dashboard patrimonial informativo", "Investment Hub filtrado por país", "Deal Room con permisos", user.role === "Admin BINV" ? "Panel Admin completo" : "Panel Admin restringido"]} icon={ShieldCheck} />
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["País seleccionado", config.label],
          ["Moneda base", `${config.baseCurrency} / ${config.secondaryCurrency}`],
          ["Contexto", config.context],
          ["Rol BINV", "Originador, asesor, estructurador y conector"]
        ].map(([label, value]) => (
          <Card key={label} className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-lg">{value}</CardTitle></CardHeader></Card>
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        {[
          { icon: Landmark, title: "Inversiones", text: country === "PE" ? "Oportunidades peruanas y regionales vinculadas a INVIU, Urbania y nuam como referencia." : "Oportunidades argentinas y globales vía INVIU, ADCAP, ECOVALORES e Interactive Brokers." },
          { icon: Banknote, title: "Financiamiento", text: config.financingIntro },
          { icon: Building2, title: "Real Estate / Urbania Capital", text: config.urbaniaPositioning }
        ].map(({ icon: Icon, title, text }) => (
          <Card key={title} className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)] transition hover:border-[#BFA46A]">
            <CardHeader><Icon className="h-6 w-6 text-[#9C7A3E]" /><CardTitle>{title}</CardTitle><CardDescription>{text}</CardDescription></CardHeader>
          </Card>
        ))}
      </section>
      <OperationalDisclaimer country={country} />
    </>
  );
}

function Dashboard({ country, user }: { country: CountryCode; user: DemoUser }) {
  const config = countryConfig[country];
  return (
    <section className="space-y-6">
      <SectionTitle eyebrow="Dashboard" title="Vista patrimonial informativa" text={`Resumen institucional para ${config.label}. Los saldos y rendimientos deben validarse con el aliado, custodio o plataforma correspondiente.`} />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Patrimonio informativo total", "USD 1,245,000"],
          ["Rendimiento YTD informativo", "9.8%"],
          ["Próximas distribuciones", country === "PE" ? "USD 18,420" : "USD 11,820"],
          ["KYC / KYB", `${user.kyc} / ${user.kyb}`],
          ["Perfil de riesgo", config.riskProfile],
          ["Aliado custodio principal", config.dashboardCustodian],
          ["Última actualización", "05 May 2026"],
          ["Estado de datos", "Pendiente validación custodio"]
        ].map(([label, value]) => (
          <Card key={label} className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-xl text-[#07111F]">{value}</CardTitle></CardHeader></Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Distribución de portafolio</CardTitle></CardHeader><CardContent><Donut /></CardContent></Card>
        <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Activos por clase</CardTitle></CardHeader><CardContent><MiniBarChart data={[{ label: "Valores", value: 42 }, { label: "Real estate", value: 24 }, { label: "Deuda", value: 18 }, { label: "Fondos", value: 10 }, { label: "Global", value: 6 }]} /></CardContent></Card>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <InfoList title="Próxima acción recomendada" items={[user.kyc === "Aprobado" ? config.nextAction : "Completar validación KYC/KYB antes de acceder a data rooms.", "Confirmar documentos pendientes", "Agendar revisión patrimonial con asesor BINV"]} icon={Bell} />
        <InfoList title="Documentos pendientes" items={["Declaración fiscal actualizada", "Validación de beneficiario final", "Confirmación de custodio / plataforma"]} icon={FileCheck2} />
        <InfoList title="Asesor asignado" items={["María Torres", "wealth@binvcapital.com", "Próxima llamada: 08 May 2026"]} icon={UserRoundCheck} />
      </div>
    </section>
  );
}

function InvestmentHub({
  opportunities,
  filters,
  options,
  apiStatus,
  setters,
  onDeal
}: {
  opportunities: Opportunity[];
  filters: Record<string, string>;
  options: { partnerOptions: string[] };
  apiStatus: "loading" | "connected" | "fallback";
  setters: Record<string, (value: string) => void>;
  onDeal: (deal: Opportunity) => void;
}) {
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => key !== "query" && value !== "Todos" && value !== "Activo").length + (filters.query ? 1 : 0);
  function clearFilters() {
    setters.setAsset("Todos");
    setters.setPartner("Todos");
    setters.setRisk("Todos");
    setters.setStatus("Todos");
    setters.setCurrency("Todos");
    setters.setTicket("Todos");
    setters.setTerm("Todos");
    setters.setCountryFilter("Activo");
    setters.setQuery("");
  }
  return (
    <section className="space-y-5">
      <SectionTitle eyebrow="Investment Hub" title="Oportunidades seleccionadas" text="Todas las oportunidades muestran aliado operativo, rol del aliado, estado de derivación y rol de BINV." />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#DED6C7] bg-[#FCFAF7] p-4">
        <div>
          <p className="text-sm font-semibold text-[#07111F]">{opportunities.length} oportunidades visibles · {activeFilterCount} filtros activos</p>
          <p className="mt-1 text-xs text-[#667085]">{apiStatus === "connected" ? "API BINV conectada" : apiStatus === "loading" ? "Sincronizando oportunidades..." : "Fallback local activo"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearFilters}>Limpiar filtros</Button>
      </div>
      <Card className="rounded-md border-[#DED6C7]"><CardContent className="grid gap-3 p-4 lg:grid-cols-4">
        <FormField label="Buscar" className="relative lg:col-span-2"><Search className="absolute left-3 top-[34px] h-4 w-4 text-[#667085]" /><Input className="pl-9" value={filters.query} onChange={(event) => setters.setQuery(event.target.value)} placeholder="Oportunidad, aliado, mercado o activo" /></FormField>
        <FilterSelect label="País" value={filters.countryFilter} onChange={setters.setCountryFilter} items={["Activo", "Todos", "PE", "AR", "GLOBAL"]} />
        <FilterSelect label="Activo" value={filters.asset} onChange={setters.setAsset} items={assetFilters} />
        <FilterSelect label="Aliado" value={filters.partner} onChange={setters.setPartner} items={["Todos", ...options.partnerOptions]} />
        <FilterSelect label="Riesgo" value={filters.risk} onChange={setters.setRisk} items={riskFilters} />
        <FilterSelect label="Estado" value={filters.status} onChange={setters.setStatus} items={statusFilters} />
        <FilterSelect label="Moneda" value={filters.currency} onChange={setters.setCurrency} items={["Todos", "USD", "PEN", "ARS"]} />
        <FilterSelect label="Ticket" value={filters.ticket} onChange={setters.setTicket} items={["Todos", "50k+", "100k+"]} />
        <FilterSelect label="Plazo" value={filters.term} onChange={setters.setTerm} items={["Todos", "Corto", "Medio / largo"]} />
      </CardContent></Card>
      <OpportunityTable opportunities={opportunities} onDeal={onDeal} />
      <div className="grid gap-4 lg:grid-cols-2">{opportunities.slice(0, 2).map((deal) => <DealCard key={deal.id} deal={deal} onDeal={onDeal} />)}</div>
    </section>
  );
}

function FilterSelect({ label, value, onChange, items }: { label?: string; value: string; onChange: (value: string) => void; items: string[] }) {
  return (
    <label className="relative grid gap-1.5 text-sm font-semibold text-[#344054]">
      {label ? <span>{label}</span> : null}
      <Filter className={cn("absolute left-3 h-4 w-4 text-[#667085]", label ? "top-[34px]" : "top-3")} />
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border bg-[#FCFAF7] pl-9 pr-3 text-sm font-semibold">
        {items.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function DealRoom({ country, deal, user }: { country: CountryCode; deal: Opportunity; user: DemoUser }) {
  const fallbackAccess = canAccessDataRoom(user, deal);
  const [accessResult, setAccessResult] = useState<DataRoomAccessResult | null>(null);
  const [accessStatus, setAccessStatus] = useState<"checking" | "connected" | "fallback">("checking");
  const hasDataRoomAccess = accessResult?.allowed ?? fallbackAccess;

  useEffect(() => {
    const controller = new AbortController();
    setAccessStatus("checking");

    fetch("/api/binv/data-room/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: toApiUser(user, country), opportunityId: deal.id }),
      signal: controller.signal
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("No se pudo validar acceso")))
      .then((payload: { data: DataRoomAccessResult }) => {
        setAccessResult(payload.data);
        setAccessStatus("connected");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAccessResult(null);
        setAccessStatus("fallback");
      });

    return () => controller.abort();
  }, [country, deal.id, user]);

  return (
    <section className="space-y-5">
      <SectionTitle eyebrow="Deal Room" title={deal.name} text={deal.summary} />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Resumen ejecutivo</CardTitle><CardDescription>{deal.summary}</CardDescription></CardHeader></Card>
          <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Tesis de inversión</CardTitle><CardDescription>{deal.thesis}</CardDescription></CardHeader></Card>
          <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Estructura del deal</CardTitle><CardDescription>{deal.structure}</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-3"><InfoPill label="Aliado operativo" value={deal.operatingPartner} /><InfoPill label="Rol del aliado" value={deal.partnerRole} /><InfoPill label="Mercado / infraestructura" value={deal.marketReference} /></CardContent></Card>
          <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Riesgos principales</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm text-[#475467] md:grid-cols-3">{["Riesgo de mercado, tasa y liquidez.", "Riesgo de contraparte, documentación y ejecución.", "Disponibilidad sujeta a perfil, país y aprobación del aliado."].map((item) => <p key={item} className="rounded-md border border-[#DED6C7] bg-[#F4EFE7] p-3">{item}</p>)}</CardContent></Card>
          <DataRoomSection user={user} deal={deal} hasAccess={hasDataRoomAccess} accessStatus={accessStatus} accessReason={accessResult?.reason} />
          <FinancingPipeline title="Flujo del deal" items={["Solicitud de acceso", "Validación KYC/KYB", "Revisión BINV", "Derivación a aliado operativo", "Ejecución externa", "Seguimiento informativo"]} />
          <InfoList title="FAQ del deal" items={["El acceso depende de KYC/KYB y clasificación de cliente.", "La documentación final pertenece al aliado, custodio, mercado o vehículo.", "BINV no recibe órdenes ni ejecuta operaciones desde la plataforma."]} icon={FileText} />
        </div>
        <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Ficha operativa</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
          {[["País", deal.country], ["Moneda", deal.currency], ["Ticket mínimo", money(deal.ticket, deal.currency)], ["Retorno esperado", deal.targetReturn], ["Plazo", deal.term], ["Riesgo", deal.risk], ["Estado", deal.status], ["Rol BINV", deal.binvRole], ["Estado de derivación", deal.referralStatus], ["Estructura legal", deal.legal]].map(([k, v]) => <div key={k} className="border-b border-[#DED6C7] pb-2"><p className="text-[#667085]">{k}</p><strong>{v}</strong></div>)}
          <Button className="w-full">Solicitar evaluación</Button><Button className="w-full" variant="secondary">Conectar con aliado operativo</Button><Button className="w-full" variant="outline">{hasDataRoomAccess ? "Acceder al data room" : "Solicitar acceso al data room"}</Button>
        </CardContent></Card>
      </div>
      <OperationalDisclaimer country={country} deal={deal} />
    </section>
  );
}

function DataRoomSection({ user, deal, hasAccess, accessStatus, accessReason }: { user: DemoUser; deal: Opportunity; hasAccess: boolean; accessStatus: "checking" | "connected" | "fallback"; accessReason?: string }) {
  const docs = ["Memo ejecutivo.pdf", "Modelo financiero.xlsx", "Term sheet preliminar.pdf"];
  return (
    <Card className={cn("rounded-md border-[#DED6C7]", !hasAccess && "border-[#BFA46A]/60 bg-[#FFF8E8]")}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Documentos del data room</CardTitle>
            <CardDescription>{hasAccess ? "Acceso habilitado para revisión documental." : `${accessReason ?? "Acceso restringido"}. ${user.role} · KYC ${user.kyc} · ${deal.status}.`}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={accessStatus === "connected" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-[#BFA46A]/45 bg-[#BFA46A]/10 text-[#7A6032]"}>{accessStatus === "connected" ? "API validada" : accessStatus === "checking" ? "Validando..." : "Fallback local"}</Badge>
            <Badge variant="outline" className={hasAccess ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-[#BFA46A]/45 bg-[#BFA46A]/10 text-[#7A6032]"}>{hasAccess ? "Habilitado" : "Requiere aprobación"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">{docs.map((doc) => <div key={doc} className="flex items-center gap-2 rounded-md border border-[#DED6C7] bg-[#FCFAF7] p-3 text-sm"><LockKeyhole className="h-4 w-4 text-[#9C7A3E]" />{hasAccess ? doc : `${doc} · bloqueado`}</div>)}</CardContent>
    </Card>
  );
}

function Portfolio({ country }: { country: CountryCode }) {
  return (
    <section className="space-y-5">
      <SectionTitle eyebrow="Portfolio" title="Posiciones y cashflow proyectado" text="Portfolio informativo. No sustituye extractos oficiales del custodio, broker, ALyC, sociedad administradora, fiduciario o aliado correspondiente." />
      <MarketPortfolioValuation country={country} />
      <div className="grid gap-4">{portfolioByCountry[country].map((item) => <PortfolioPositionCard key={item.name} item={item} />)}</div>
      <Card className="rounded-md border-[#DED6C7]"><CardHeader><CardTitle>Cashflow proyectado</CardTitle></CardHeader><CardContent><MiniBarChart data={[{ label: "Jun", value: 14 }, { label: "Jul", value: 28 }, { label: "Ago", value: 22 }, { label: "Sep", value: 36 }]} /></CardContent></Card>
    </section>
  );
}

function MarketPortfolioValuation({ country }: { country: CountryCode }) {
  const positions = useMemo(() => getMarketPortfolioPositions(country), [country]);
  const [valuation, setValuation] = useState<PortfolioValuation | null>(null);
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    fetch("/api/binv/portfolio/valuation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseCurrency: "USD", positions }),
      signal: controller.signal
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("No se pudo valorizar portfolio")))
      .then((payload: { data: PortfolioValuation }) => {
        setValuation(payload.data);
        setStatus("connected");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setValuation(null);
        setStatus("error");
      });

    return () => controller.abort();
  }, [positions]);

  return (
    <Card className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Portfolio mercado de valores</CardTitle>
            <CardDescription>Tenencias cargadas manualmente y seguimiento por market data backend.</CardDescription>
          </div>
          <Badge variant="outline" className={status === "connected" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-[#BFA46A]/45 bg-[#BFA46A]/10 text-[#7A6032]"}>
            {status === "connected" ? "API valorización conectada" : status === "loading" ? "Valorizando..." : "Sin conexión API"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {valuation ? (
          <>
            <div className="grid gap-3 md:grid-cols-4">
              <InfoPill label="Valor mercado" value={money(valuation.totals.marketValue, valuation.baseCurrency)} />
              <InfoPill label="Costo" value={money(valuation.totals.costBasis, valuation.baseCurrency)} />
              <InfoPill label="PnL no realizado" value={money(valuation.totals.unrealizedPnl, valuation.baseCurrency)} />
              <InfoPill label="Rendimiento" value={`${valuation.totals.unrealizedPnlPercent}%`} />
            </div>
            <div className="overflow-hidden rounded-md border border-[#DED6C7]">
              {valuation.positions.map((position) => (
                <div key={`${position.symbol}-${position.market}`} className="grid gap-2 border-b border-[#DED6C7] p-3 text-sm last:border-b-0 lg:grid-cols-[0.8fr_1fr_0.5fr_0.6fr_0.7fr_0.7fr_0.6fr] lg:items-center">
                  <strong>{position.symbol}</strong>
                  <span>{position.name}</span>
                  <span>{position.quantity}</span>
                  <span>{money(position.currentPrice, position.currency)}</span>
                  <span>{money(position.marketValue, position.currency)}</span>
                  <span className={position.unrealizedPnl >= 0 ? "font-semibold text-emerald-700" : "font-semibold text-red-700"}>{money(position.unrealizedPnl, position.currency)}</span>
                  <span>{position.unrealizedPnlPercent}%</span>
                  <p className="text-xs text-[#667085] lg:col-span-7">Fuente: {position.quoteProvider}. Actualizado: {new Date(position.quoteAsOf).toLocaleString("es-PE")}.</p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-5 text-[#667085]">{valuation.notes.join(" ")}</p>
          </>
        ) : (
          <div className="rounded-md border border-[#DED6C7] bg-[#F4EFE7] p-4 text-sm text-[#475467]">No se pudo valorizar con la API. Las posiciones manuales siguen disponibles para seguimiento operativo.</div>
        )}
      </CardContent>
    </Card>
  );
}

function getMarketPortfolioPositions(country: CountryCode) {
  if (country === "AR") {
    return [
      { symbol: "AL30.BA", market: "BYMA", name: "Bono AL30", currency: "USD", quantity: 100, averageCost: 58, source: "market-data" },
      { symbol: "GD30.BA", market: "BYMA", name: "Bono GD30", currency: "USD", quantity: 80, averageCost: 60.5, source: "market-data" },
      { symbol: "SPY", market: "NYSE Arca", name: "SPDR S&P 500 ETF", currency: "USD", quantity: 12, averageCost: 590, source: "market-data" }
    ];
  }

  return [
    { symbol: "BAP.LM", market: "Bolsa de Lima", name: "Credicorp Ltd.", currency: "USD", quantity: 20, averageCost: 148, source: "market-data" },
    { symbol: "BIL", market: "NYSE Arca", name: "SPDR Bloomberg 1-3M T-Bill", currency: "USD", quantity: 75, averageCost: 91.1, source: "market-data" },
    { symbol: "SPY", market: "NYSE Arca", name: "SPDR S&P 500 ETF", currency: "USD", quantity: 8, averageCost: 590, source: "market-data" }
  ];
}

function PortfolioPositionCard({ item }: { item: PortfolioPosition }) {
  return (
    <Card className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]">
      <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_0.65fr_0.78fr_0.72fr_0.72fr] md:items-center">
        <strong>{item.name}</strong><span>{item.country} · {item.currency}</span><span>{item.operatingPartner}</span><span>{money(item.committed, item.currency)}</span><Badge variant="outline">{item.status}</Badge>
        <p className="text-sm text-[#475467] md:col-span-5">Custodio / aliado: {item.custodian}. ROI: {item.roi}. Entrada: {item.entryDate}. Próxima distribución: {item.nextDistribution}. Fuente: {item.dataSource}. Última actualización: {item.updatedAt}. Documentación: {item.documents}.</p>
      </CardContent>
    </Card>
  );
}

function Urbania({ country }: { country: CountryCode }) {
  return (
    <section className="space-y-5">
      <SectionTitle eyebrow="Urbania Capital" title="Real estate estructurado" text={`Urbania Capital es la vertical de real estate estructurado de BINV Capital. ${countryConfig[country].urbaniaPositioning} Los proyectos pueden estar disponibles según perfil, documentación y condiciones aplicables.`} />
      <div className="grid gap-5 lg:grid-cols-3">{urbaniaProjects.map((project) => <Card key={project.name} className="overflow-hidden rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><div className="relative h-40 bg-[linear-gradient(135deg,#07111F,#101828_52%,#BFA46A)]"><Image src="/images/binv/mark-orange.png" alt="" fill className="object-contain p-8 opacity-[0.12]" sizes="340px" /></div><CardHeader><Badge variant="outline">{project.status}</Badge><CardTitle>{project.name}</CardTitle><CardDescription>{project.location} · País de ejecución: Perú</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><div className="grid grid-cols-2 gap-2">{[["Estructura", project.structure], ["Sponsor", project.sponsor], ["Estado legal", project.legalStatus], ["Permisos", project.permits], ["Participación", project.participation], ["Aliado / vehículo", project.vehicle], ["Ticket", money(project.ticket)], ["Retorno", project.return], ["Plazo", project.term], ["Moneda", project.currency], ["Riesgos", project.risks], ["Documentos", project.documents]].map(([k, v]) => <div key={k} className="rounded-md bg-[#F4EFE7] p-2"><p className="text-[#667085]">{k}</p><strong>{v}</strong></div>)}</div><MiniBarChart data={[{ label: "Financiero", value: project.finance }, { label: "Obra", value: project.work }]} /><div className="flex gap-2"><Button size="sm">Ver proyecto</Button><Button size="sm" variant="outline">Solicitar acceso al data room</Button></div></CardContent></Card>)}</div>
    </section>
  );
}

function FinancingHub({ country, user }: { country: CountryCode; user: DemoUser }) {
  const config = countryConfig[country];
  const partners = partnersByCountry[country].filter((item) => item.category === "Aliado operativo" || item.category === "Infraestructura de mercado" || item.category === "Vertical BINV");
  const [response, setResponse] = useState<FinancingResponse | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function submitFinancingRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitStatus("submitting");

    const payload = {
      country,
      legalName: String(formData.get("legalName") || ""),
      taxId: String(formData.get("taxId") || ""),
      sector: String(formData.get("sector") || ""),
      revenue: String(formData.get("revenue") || ""),
      amountRequested: Number(formData.get("amountRequested") || 0),
      currency: String(formData.get("currency") || config.baseCurrency),
      useOfFunds: String(formData.get("useOfFunds") || ""),
      desiredTerm: String(formData.get("desiredTerm") || ""),
      guarantees: String(formData.get("guarantees") || ""),
      instrument: String(formData.get("instrument") || ""),
      contactName: String(formData.get("contactName") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      notes: String(formData.get("notes") || "")
    };

    try {
      const result = await fetch("/api/binv/financing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!result.ok) throw new Error("No se pudo enviar la solicitud");
      const json = await result.json() as { data: FinancingResponse };
      setResponse(json.data);
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <section className="space-y-5">
      <SectionTitle eyebrow="Financing Hub" title="Solicitud de financiamiento empresarial" text={config.financingIntro} />
      <div className="grid gap-4 md:grid-cols-3">
        <InfoPill label="Perfil activo" value={user.role} />
        <InfoPill label="Estado KYB" value={user.kyb} />
        <InfoPill label="Mercado" value={`${config.label} · ${config.baseCurrency}/${config.secondaryCurrency}`} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card className="rounded-md border-[#DED6C7]"><CardContent className="p-5">
          <form onSubmit={submitFinancingRequest} className="grid gap-3 md:grid-cols-2">
            <FormField label="País"><Input value={config.label} readOnly /></FormField>
            <FormField label="Razón social"><Input name="legalName" required placeholder="Empresa Demo SAC" defaultValue={country === "PE" ? "Inmobiliaria Andina SAC" : "Empresa Demo SA"} /></FormField>
            <FormField label={country === "AR" ? "CUIT" : "RUC"}><Input name="taxId" required placeholder={country === "AR" ? "30-12345678-9" : "20601234567"} defaultValue={country === "AR" ? "30-12345678-9" : "20601234567"} /></FormField>
            <FormField label="Sector"><Input name="sector" required placeholder="Real estate, agro, industria..." defaultValue={country === "PE" ? "Real estate" : "Agroindustria"} /></FormField>
            <FormField label="Facturación mensual/anual"><Input name="revenue" required placeholder="USD 2M anual" defaultValue={country === "PE" ? "USD 2.4M anual" : "ARS 250M anual"} /></FormField>
            <FormField label="Monto requerido"><Input name="amountRequested" required type="number" min="1" placeholder="150000" defaultValue={country === "PE" ? 250000 : 150000} /></FormField>
            <FormField label="Moneda"><select name="currency" className="h-11 w-full rounded-md border bg-[#FCFAF7] px-3 text-sm" defaultValue={config.baseCurrency}><option>USD</option><option>PEN</option><option>ARS</option></select></FormField>
            <FormField label="Destino de fondos"><Input name="useOfFunds" required placeholder="Capital de trabajo, obra, expansión..." defaultValue="Capital de trabajo y estructura de crecimiento" /></FormField>
            <FormField label="Plazo buscado"><Input name="desiredTerm" required placeholder="180 días / 24 meses" defaultValue={country === "PE" ? "24 meses" : "180 días"} /></FormField>
            <FormField label="Garantías disponibles"><Input name="guarantees" placeholder="Cheques, facturas, inmueble, contratos..." defaultValue={country === "PE" ? "Contrato de preventa y flujo de proyecto" : "Cheques y facturas"} /></FormField>
            <FormField label="Contacto"><Input name="contactName" required placeholder="Nombre y apellido" defaultValue="Ana Demo" /></FormField>
            <FormField label="Email"><Input name="contactEmail" required type="email" placeholder="ana@empresa.com" defaultValue="ana@example.com" /></FormField>
            <FormField label="Instrumento posible"><select name="instrument" className="h-11 w-full rounded-md border bg-[#FCFAF7] px-3 text-sm"><option value="">Recomendar automáticamente</option>{financingInstrumentsByCountry[country].map((item) => <option key={item}>{item}</option>)}</select></FormField>
            <Button type="button" variant="outline"><Upload className="h-4 w-4" />Documentos adjuntos</Button>
            <FormField label="Comentarios para análisis BINV" className="md:col-span-2"><Textarea name="notes" placeholder="Describe necesidad, urgencia, flujo de fondos y documentación disponible." /></FormField>
            <Button className="md:col-span-2" disabled={submitStatus === "submitting"}>{submitStatus === "submitting" ? "Enviando..." : "Enviar solicitud de evaluación"}</Button>
            {submitStatus === "error" ? <p className="md:col-span-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">No se pudo enviar la solicitud. Revisa campos requeridos o intenta nuevamente.</p> : null}
          </form>
        </CardContent></Card>
        <div className="space-y-5">
          {response ? (
            <InfoList title={`Solicitud ${response.id}`} items={[`Estado: ${response.status}`, `Instrumento recomendado: ${response.recommendedInstrument}`, response.nextAction]} icon={CheckCircle2} />
          ) : null}
          <FinancingPipeline title="Pipeline de solicitud" items={response?.pipeline ?? ["Recibido", "En análisis BINV", "Documentación requerida", "Perfilamiento de instrumento", "Enviado a aliado", "En evaluación por aliado", "Aprobado", "Rechazado", "Cerrado"]} />
          <InfoList title="Aliados e infraestructura" items={partners.map((item) => `${item.name}: ${item.role}`)} icon={Handshake} />
        </div>
      </div>
    </section>
  );
}

function FinancingPipeline({ title, items }: { title: string; items: string[] }) {
  return <InfoList title={title} items={items} icon={CheckCircle2} />;
}

function AdminPanel({ country }: { country: CountryCode }) {
  const modules = ["Usuarios", "KYC/KYB", "Oportunidades", "Deals", "Urbania Projects", "Solicitudes de financiamiento", "Aliados", "Países", "Documentos", "Data rooms", "Logs de auditoría", "Configuración de disclaimers", "FAQ", "Roles y permisos"];
  return (
    <section className="space-y-5">
      <SectionTitle eyebrow="Admin Panel" title="Gestión institucional" text={`Control operativo para contenido, usuarios y procesos por país activo: ${countryConfig[country].label}.`} />
      <div className="grid gap-4 md:grid-cols-4">{["KYC pendientes 12", "Deals activos 8", "Solicitudes 19", "Usuarios 248"].map((item) => <AdminMetricCard key={item} label={item} />)}</div>
      <div className="grid gap-5 lg:grid-cols-2">
        <InfoList title="Módulos" items={modules} icon={ShieldCheck} />
        <InfoList title="Acciones" items={["Aprobar/rechazar KYC", "Solicitar documentos", "Crear oportunidad", "Editar oportunidad", "Activar/desactivar deal", "Subir documentos", "Asignar asesor", "Derivar a aliado", "Cambiar estado pipeline", "Configurar contenido por país"]} icon={FileCheck2} />
        <InfoList title="Logs de auditoría" items={["Login", "Cambio país activo", "Descarga de documento", "Solicitud de acceso a data room", "Aprobación KYC", "Rechazo KYC", "Edición de oportunidad", "Derivación a aliado", "Cambio de estado de financiamiento", "Comentario interno"]} icon={Bell} />
        <InfoList title="Roles" items={["Super Admin", "Admin BINV", "Asesor", "Analista", "Cliente inversionista", "Empresa solicitante", "Aliado externo"]} icon={UserRoundCheck} />
      </div>
    </section>
  );
}

function AdminMetricCard({ label }: { label: string }) {
  return <Card className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><CardTitle>{label}</CardTitle></CardHeader></Card>;
}

function InvestorRelations({ country }: { country: CountryCode }) {
  const docs = country === "PE" ? ["Información legal Perú", "Reportes Urbania", "Comunicados BINV Perú", "Estados informativos", "Gobierno corporativo", "Biblioteca de documentos"] : ["Información legal Argentina", "Reportes de mercado", "Comunicados BINV Argentina", "Estados informativos", "Gobierno corporativo", "Biblioteca de documentos"];
  return <section className="space-y-5"><SectionTitle eyebrow="Relación con Inversionistas" title="Conoce más sobre Relación con Inversionistas" text="Información legal, financiera e institucional disponible según perfil, país y estado de acceso." /><Card className="rounded-md border-[#DED6C7]"><CardContent className="grid gap-3 p-4 md:grid-cols-4"><FilterSelect value={country} onChange={() => undefined} items={[country]} /><FilterSelect value="Tipo de documento" onChange={() => undefined} items={["Tipo de documento", "Legal", "Reporte", "Comunicado", "Institucional"]} /><FilterSelect value="2026" onChange={() => undefined} items={["2026", "2025", "2024"]} /><FilterSelect value="Acceso aprobado" onChange={() => undefined} items={["Acceso aprobado", "Público", "Restringido"]} /></CardContent></Card><div className="grid gap-4 md:grid-cols-3">{docs.map((item) => <Card key={item} className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><FileText className="h-5 w-5 text-[#9C7A3E]" /><CardTitle>{item}</CardTitle><CardDescription>Repositorio con acceso según perfil y país activo.</CardDescription></CardHeader></Card>)}</div><OperationalDisclaimer country={country} /></section>;
}

function Login() {
  return <section className="mx-auto max-w-md space-y-5"><SectionTitle title="Acceso de clientes" text="Ingreso para inversionistas, empresas solicitantes, asesores y aliados externos." /><Card className="rounded-md border-[#DED6C7]"><CardContent className="space-y-3 p-5"><FormField label="Email corporativo"><Input placeholder="nombre@empresa.com" /></FormField><FormField label="Contraseña"><Input placeholder="Contraseña" type="password" /></FormField><Button className="w-full">Ingresar</Button><Button className="w-full" variant="outline">Registro inversionista</Button><Button className="w-full" variant="outline">Registro empresa</Button></CardContent></Card></section>;
}

function Profile({ country, user, onLogout }: { country: CountryCode; user: DemoUser; onLogout: () => void }) {
  const config = countryConfig[country];
  return <section className="space-y-5"><SectionTitle eyebrow="Perfil" title="Perfil del cliente" text="Preferencias, países habilitados, asesor asignado y estado documental." /><div className="grid gap-5 md:grid-cols-2"><InfoList title="Perfil activo" items={[`Usuario demo: ${user.name}`, `Rol: ${user.role}`, `Perfil: ${user.profile}`, `Estado KYC: ${user.kyc}`, `Estado KYB: ${user.kyb}`, `País principal: ${config.label}`, `Países habilitados: ${country === "PE" ? "Perú / Argentina previa validación" : "Argentina / Perú previa validación"}`, `Moneda base: ${config.baseCurrency}`, `Perfil de riesgo: ${config.riskProfile}`, "Asesor: María Torres"]} icon={UserRoundCheck} /><InfoList title="Aliados y preferencias" items={[...partnersByCountry[country].slice(0, 4).map((item) => item.name), "Notificaciones: oportunidades, distribuciones, documentos pendientes y cambios regulatorios", "Documentos pendientes: declaración fiscal y actualización patrimonial"]} icon={Bell} /></div><Button variant="outline" onClick={onLogout}>Salir del demo</Button></section>;
}

function Kyc({ country, user }: { country: CountryCode; user: DemoUser }) {
  const localId = country === "AR" ? "CUIT" : "RUC";
  return <section className="space-y-5"><SectionTitle eyebrow="KYC / KYB" title="Validación obligatoria antes de data rooms sensibles" text="Usuarios sin KYC acceden solo a información pública. Empresas pueden solicitar financiamiento sin ver información sensible de inversionistas." /><div className="grid gap-4 md:grid-cols-3"><InfoPill label="Rol" value={user.role} /><InfoPill label="KYC" value={user.kyc} /><InfoPill label="KYB" value={user.kyb} /></div><div className="grid gap-5 lg:grid-cols-2"><InfoList title="KYC" items={["Identidad: Aprobado", "Domicilio: En revisión", "Origen de fondos: Requiere actualización", "Perfil de riesgo: Aprobado", "Declaraciones: En revisión", "Beneficiario final: Aprobado", "Estado fiscal: Observado", `Aprobación interna: ${user.kyc}`]} icon={BadgeCheck} /><InfoList title="KYB" items={["Razón social", localId, "Representante legal", "Estados financieros", "Endeudamiento", "Garantías", "Documentación societaria", "Beneficiario final", "Análisis crediticio", `Estado de revisión: ${user.kyb}`]} icon={BriefcaseBusiness} /></div></section>;
}

function Partners({ country }: { country: CountryCode }) {
  const groups = ["Aliado operativo", "Infraestructura de mercado", "Custodia / acceso internacional", "Vertical BINV", "Referencia regional"] as Partner["category"][];
  return <section className="space-y-5"><SectionTitle eyebrow="Aliados" title="Ecosistema operativo" text="Se separan aliados operativos, infraestructura, custodia, verticales BINV y referencias regionales. BYMA, MAE/A3 y nuam se presentan como infraestructura o referencia de mercado, no como aliados comerciales directos." />{groups.map((group) => { const list = partnersByCountry[country].filter((item) => item.category === group); return list.length ? <div key={group} className="space-y-3"><h3 className="text-lg font-bold text-[#07111F]">{group}</h3><div className="grid gap-4 md:grid-cols-3">{list.map((ally) => <Card key={ally.name} className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><Handshake className="h-5 w-5 text-[#9C7A3E]" /><CardTitle>{ally.name}</CardTitle><CardDescription>{ally.role}</CardDescription></CardHeader></Card>)}</div></div> : null; })}</section>;
}

function Legal({ country }: { country: CountryCode }) {
  return <section className="space-y-5"><SectionTitle eyebrow="Legal" title="Disclaimers operativos" /><OperationalDisclaimer country={country} /><InfoList title="Alcance de BINV Capital" items={["BINV muestra oportunidades, análisis, documentación, seguimiento, formularios y derivación comercial hacia aliados.", "Los clientes no invierten ni se financian dentro de la plataforma BINV.", "La ejecución se realiza a través de aliados externos autorizados cuando corresponda.", "Toda inversión implica riesgos. Las rentabilidades esperadas no garantizan resultados futuros."]} icon={Globe2} /></section>;
}

function Faq({ country }: { country: CountryCode }) {
  return <section className="space-y-5"><SectionTitle eyebrow="FAQ" title="Preguntas frecuentes" /><div className="grid gap-4 md:grid-cols-2">{faqByCountry[country].map((item) => <Card key={item.question} className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><CardTitle className="text-lg">{item.question}</CardTitle><CardDescription>{item.answer}</CardDescription></CardHeader></Card>)}</div></section>;
}

function InfoList({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof BarChart3 }) {
  return <Card className="rounded-md border-[#DED6C7] bg-[#FCFAF7] shadow-[0_18px_50px_-38px_rgba(11,16,32,0.45)]"><CardHeader><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-[#9C7A3E]" /><CardTitle>{title}</CardTitle></div></CardHeader><CardContent className="space-y-2">{items.map((item) => <div key={item} className="flex items-start gap-2 rounded-md bg-[#F4EFE7] p-3 text-sm text-[#475467]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#027A48]" />{item}</div>)}</CardContent></Card>;
}

function FormField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <label className={cn("grid gap-1.5 text-sm font-semibold text-[#344054]", className)}><span>{label}</span>{children}</label>;
}


