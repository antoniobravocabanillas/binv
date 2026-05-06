import { fail } from "@/lib/server/api";

export function requireBinvAdmin(request: Request) {
  const role = request.headers.get("x-binv-admin-role");
  if (role !== "Admin BINV") {
    return {
      response: fail("Acceso admin BINV requerido", 401)
    };
  }

  return { response: null };
}
