import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/lib/server/product-actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!product) notFound();
  const action = updateProductAction.bind(null, product.id);

  return (
    <section className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Editar producto</h1>
      <p className="mt-2 text-muted-foreground">{product.name}</p>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} action={action} />
      </div>
    </section>
  );
}
