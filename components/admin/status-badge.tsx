import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "accent" }> = {
  NEW: { label: "Nuevo", variant: "secondary" },
  CONTACTED: { label: "Contactado", variant: "default" },
  QUALIFIED: { label: "Calificado", variant: "accent" },
  WON: { label: "Ganado", variant: "accent" },
  LOST: { label: "Perdido", variant: "outline" },
  PENDING: { label: "Pendiente", variant: "secondary" },
  QUOTED: { label: "Cotizado", variant: "default" },
  PAID: { label: "Pagado", variant: "accent" },
  PROCESSING: { label: "En proceso", variant: "default" },
  SHIPPED: { label: "Enviado", variant: "default" },
  COMPLETED: { label: "Completado", variant: "accent" },
  CANCELLED: { label: "Cancelado", variant: "outline" }
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
