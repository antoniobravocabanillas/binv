import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/utils";
import { fail, handleApiError } from "@/lib/server/api";
import { requireUser } from "@/lib/server/authz";
import {
  ALLOWED_CUSTOMER_FILE_TYPES,
  createCustomerFileKey,
  getCustomerFileStore,
  MAX_CUSTOMER_FILE_SIZE
} from "@/lib/server/media";

export async function POST(request: Request) {
  const { response, session } = await requireUser();
  if (response) return response;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((file): file is File => file instanceof File);

    if (!files.length) return fail("No se recibieron archivos.", 400);
    if (files.length > 8) return fail("Puedes subir hasta 8 archivos por carga.", 400);

    const store = getCustomerFileStore();
    const uploadedFiles = [];

    for (const file of files) {
      if (!ALLOWED_CUSTOMER_FILE_TYPES.has(file.type)) {
        return fail(`Formato no permitido: ${file.name}. Usa imagenes o PDF.`, 400);
      }

      if (file.size > MAX_CUSTOMER_FILE_SIZE) {
        return fail(`El archivo ${file.name} supera el limite de 10 MB.`, 400);
      }

      const key = createCustomerFileKey(file.name);
      await store.set(key, await file.arrayBuffer(), {
        metadata: {
          contentType: file.type,
          originalName: file.name,
          size: file.size,
          uploadedBy: session?.user?.id,
          uploadedAt: new Date().toISOString()
        }
      });

      uploadedFiles.push({
        key,
        url: absoluteUrl(`/api/media/${key}`),
        contentType: file.type,
        fileName: file.name,
        size: file.size
      });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    return handleApiError(error);
  }
}
