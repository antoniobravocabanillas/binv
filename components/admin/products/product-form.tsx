import type { Category, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  product?: Product;
};

export function ProductForm({ action, categories, product }: ProductFormProps) {
  const specs = product?.specifications && typeof product.specifications === "object" && !Array.isArray(product.specifications)
    ? Object.entries(product.specifications as Record<string, string>).map(([key, value]) => `${key}: ${value}`).join("\n")
    : "";
  const images = product?.images?.length ? product.images.join("\n") : "";

  return (
    <form action={action} className="grid gap-5 rounded-lg border bg-card p-6 shadow-technical">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre"><Input name="name" required defaultValue={product?.name || ""} /></Field>
        <Field label="SKU"><Input name="sku" required defaultValue={product?.sku || ""} /></Field>
        <Field label="Slug"><Input name="slug" defaultValue={product?.slug || ""} placeholder="se genera si queda vacio" /></Field>
        <Field label="Marca"><Input name="brand" required defaultValue={product?.brand || ""} /></Field>
        <Field label="Modelo"><Input name="model" defaultValue={product?.model || ""} /></Field>
        <Field label="Categoria">
          <select name="categoryId" required defaultValue={product?.categoryId || ""} className="h-11 w-full rounded-md border bg-background px-3 text-sm">
            <option value="" disabled>Seleccionar categoria</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </Field>
        <Field label="Precio USD"><Input name="price" type="number" min="0" step="0.01" defaultValue={product?.price?.toString() || ""} /></Field>
        <Field label="Stock"><Input name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 0} /></Field>
        <Field label="Disponibilidad"><Input name="availability" required defaultValue={product?.availability || "Consultar stock"} /></Field>
        <Field label="Badge"><Input name="badge" defaultValue={product?.badge || ""} placeholder="Nuevo, Oferta, Destacado, Cotizar" /></Field>
      </div>

      <Field label="Resumen"><Textarea name="summary" required defaultValue={product?.summary || ""} /></Field>
      <Field label="Descripcion"><Textarea name="description" required defaultValue={product?.description || ""} /></Field>
      <Field label="Especificaciones tecnicas">
        <Textarea name="specifications" defaultValue={specs} placeholder={"Precision: 5 segundos\nAlcance: 500 m"} />
      </Field>
      <Field label="Imagenes del producto">
        <Textarea
          name="images"
          defaultValue={images}
          placeholder={"https://cdn.ejemplo.com/estacion-total-frontal.jpg\nhttps://cdn.ejemplo.com/estacion-total-kit.jpg"}
          rows={4}
        />
      </Field>
      <Field label="Ficha tecnica URL"><Input name="technicalSheet" defaultValue={product?.technicalSheet || ""} /></Field>

      <label className="flex items-center gap-3 text-sm font-medium">
        <input name="requiresQuote" type="checkbox" defaultChecked={product?.requiresQuote ?? true} />
        Requiere cotizacion
      </label>

      <Button type="submit">{product ? "Guardar cambios" : "Crear producto"}</Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
