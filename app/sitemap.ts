import type { MetadataRoute } from "next";
import { products } from "@/lib/content/products";
import { posts } from "@/lib/content/site";
import { services } from "@/lib/content/services";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/nosotros", "/servicios", "/proyectos", "/sectores", "/tienda", "/blog", "/contacto", "/cotizacion", "/faq", "/privacidad", "/terminos"];
  return [
    ...staticRoutes.map((route) => ({ url: absoluteUrl(route), lastModified: new Date() })),
    ...services.map((service) => ({ url: absoluteUrl(`/servicios/${service.slug}`), lastModified: new Date() })),
    ...products.map((product) => ({ url: absoluteUrl(`/tienda/${product.slug}`), lastModified: new Date() })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: new Date() }))
  ];
}
