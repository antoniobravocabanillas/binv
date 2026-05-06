import { handleApiError, ok, parseJson } from "@/lib/server/api";
import { requireBinvAdmin } from "@/lib/binv/admin-auth";
import { adminOpportunityPatchSchema } from "@/lib/validations/binv";
import { deleteOpportunity, updateOpportunity } from "@/lib/binv/repository";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = requireBinvAdmin(request);
  if (response) return response;

  try {
    const { id } = await context.params;
    const payload = await parseJson(request, adminOpportunityPatchSchema);
    const data = await updateOpportunity(id, payload);
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = requireBinvAdmin(request);
  if (response) return response;

  try {
    const { id } = await context.params;
    return ok(await deleteOpportunity(id));
  } catch (error) {
    return handleApiError(error);
  }
}
