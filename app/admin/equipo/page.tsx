import { StaffDepartment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import {
  createStaffProfileAction,
  deleteStaffProfileAction,
  updateStaffProfileAction
} from "@/lib/server/admin-actions";

const departments: Array<[StaffDepartment, string]> = [
  ["SALES", "Ventas tecnicas"],
  ["TECHNICAL_SUPPORT", "Soporte tecnico"],
  ["FIELD_ENGINEERING", "Campo e ingenieria"],
  ["RENTAL_SERVICE", "Alquiler y servicio"],
  ["ADMINISTRATION", "Administracion"]
];

type StaffTools = {
  whatsappTemplate?: string;
  checklist?: string[];
  nextSteps?: string[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTeamPage() {
  const profiles = await prisma.staffProfile.findMany({
    orderBy: [{ active: "desc" }, { department: "asc" }, { displayName: "asc" }]
  });

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Equipo comercial</p>
        <h1 className="font-display text-3xl font-bold">Perfiles de vendedores y tecnicos</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Define perfiles asignables al chat, especialidades y herramientas de trabajo para responder con criterio comercial.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo perfil</CardTitle>
          <CardDescription>Este perfil se podra asignar a conversaciones del chat.</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffProfileForm action={createStaffProfileAction} submitLabel="Crear perfil" />
        </CardContent>
      </Card>

      <div className="grid gap-5">
        {profiles.map((profile) => {
          const tools = profile.tools as StaffTools;
          return (
            <Card key={profile.id}>
              <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{profile.displayName}</CardTitle>
                  <CardDescription>{profile.roleTitle} | {departmentLabel(profile.department)}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={profile.active ? "accent" : "outline"}>{profile.active ? "Activo" : "Inactivo"}</Badge>
                  {profile.specialties.slice(0, 4).map((specialty) => <Badge key={specialty} variant="outline">{specialty}</Badge>)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <StaffProfileForm
                  action={updateStaffProfileAction.bind(null, profile.id)}
                  submitLabel="Guardar cambios"
                  defaults={{
                    displayName: profile.displayName,
                    email: profile.email || "",
                    phone: profile.phone || "",
                    roleTitle: profile.roleTitle,
                    department: profile.department,
                    specialties: profile.specialties.join("\n"),
                    whatsappTemplate: tools.whatsappTemplate || "",
                    checklist: tools.checklist?.join("\n") || "",
                    nextSteps: tools.nextSteps?.join("\n") || "",
                    active: profile.active
                  }}
                />
                <form action={deleteStaffProfileAction.bind(null, profile.id)}>
                  <Button type="submit" variant="destructive">Eliminar perfil</Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function StaffProfileForm({
  action,
  submitLabel,
  defaults
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  defaults?: {
    displayName: string;
    email: string;
    phone: string;
    roleTitle: string;
    department: StaffDepartment;
    specialties: string;
    whatsappTemplate: string;
    checklist: string;
    nextSteps: string;
    active: boolean;
  };
}) {
  return (
    <form action={action} className="grid gap-3 md:grid-cols-2">
      <Input name="displayName" placeholder="Nombre visible" defaultValue={defaults?.displayName} required />
      <Input name="roleTitle" placeholder="Cargo o perfil comercial" defaultValue={defaults?.roleTitle} required />
      <Input name="email" type="email" placeholder="Correo" defaultValue={defaults?.email} />
      <Input name="phone" placeholder="Telefono / WhatsApp" defaultValue={defaults?.phone} />
      <select name="department" defaultValue={defaults?.department || "SALES"} className="h-11 rounded-md border bg-background px-3 text-sm">
        {departments.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label className="flex items-center gap-2 rounded-md border bg-background px-3 text-sm">
        <input type="checkbox" name="active" defaultChecked={defaults?.active ?? true} />
        Activo para asignacion
      </label>
      <Textarea name="specialties" placeholder="Especialidades, una por linea" defaultValue={defaults?.specialties} />
      <Textarea name="checklist" placeholder="Checklist interno, una accion por linea" defaultValue={defaults?.checklist} />
      <Textarea name="nextSteps" placeholder="Siguientes pasos comerciales, uno por linea" defaultValue={defaults?.nextSteps} />
      <Textarea name="whatsappTemplate" placeholder="Plantilla sugerida de WhatsApp o email" defaultValue={defaults?.whatsappTemplate} />
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function departmentLabel(department: StaffDepartment) {
  return departments.find(([value]) => value === department)?.[1] || department;
}
