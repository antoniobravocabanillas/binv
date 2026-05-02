import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "accent" }> = {
  NEW: { label: "Nuevo", variant: "secondary" },
  CONTACTED: { label: "Contactado", variant: "default" },
  QUALIFIED: { label: "Calificado", variant: "accent" },
  EVALUATION: { label: "En evaluacion", variant: "default" },
  NEGOTIATION: { label: "Negociacion", variant: "default" },
  REQUIRES_TECH_SUPPORT: { label: "Soporte tecnico", variant: "secondary" },
  WON: { label: "Ganado", variant: "accent" },
  LOST: { label: "Perdido", variant: "outline" },
  LOW: { label: "Baja", variant: "outline" },
  MEDIUM: { label: "Media", variant: "secondary" },
  HIGH: { label: "Alta", variant: "default" },
  URGENT: { label: "Urgente", variant: "accent" },
  PENDING: { label: "Pendiente", variant: "secondary" },
  QUOTED: { label: "Cotizado", variant: "default" },
  DRAFT: { label: "Borrador", variant: "outline" },
  SENT: { label: "Enviada", variant: "default" },
  VIEWED: { label: "Vista", variant: "default" },
  ACCEPTED: { label: "Aceptada", variant: "accent" },
  REJECTED: { label: "Rechazada", variant: "outline" },
  EXPIRED: { label: "Vencida", variant: "outline" },
  CONVERTED: { label: "Convertida", variant: "accent" },
  APPROVED: { label: "Aprobada", variant: "default" },
  PAID: { label: "Pagado", variant: "accent" },
  PLANNING: { label: "Planificacion", variant: "outline" },
  IN_PROGRESS: { label: "En ejecucion", variant: "default" },
  FINISHED: { label: "Terminado", variant: "accent" },
  PUBLISHED: { label: "Publicado", variant: "accent" },
  ARCHIVED: { label: "Archivado", variant: "outline" },
  AVAILABLE: { label: "Disponible", variant: "accent" },
  FIELD: { label: "En campo", variant: "default" },
  BUSY: { label: "Ocupado", variant: "secondary" },
  OFFLINE: { label: "Fuera de linea", variant: "outline" },
  OPEN: { label: "Abierto", variant: "secondary" },
  REVIEWING: { label: "En revision", variant: "default" },
  WAITING_CUSTOMER: { label: "Esperando cliente", variant: "secondary" },
  RESOLVED: { label: "Resuelto", variant: "accent" },
  PROCESSING: { label: "En proceso", variant: "default" },
  SHIPPED: { label: "Enviado", variant: "default" },
  COMPLETED: { label: "Completado", variant: "accent" },
  CANCELLED: { label: "Cancelado", variant: "outline" }
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
