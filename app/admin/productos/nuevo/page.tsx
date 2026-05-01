import { ProductForm } from "@/components/admin/products/product-form";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/server/admin-page-auth";
import { createProductAction } from "@/lib/server/product-actions";

export default async function NewProductPage() {
  await requireAdminPage(["EDITOR", "ADMIN"]);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Nuevo producto</h1>
      <p className="mt-2 text-muted-foreground">Crea un producto para que aparezca en la tienda publica.</p>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProductAction} />
      </div>
    </section>
  );
}
