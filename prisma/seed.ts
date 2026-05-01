import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { categories, products } from "../lib/content/products";
import { faqs, posts, testimonials } from "../lib/content/site";
import { services } from "../lib/content/services";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin12345!", 12);
  await prisma.user.upsert({
    where: { email: "admin@icctopografia.pe" },
    update: {},
    create: {
      name: "Administrador ICC Topografia",
      email: "admin@icctopografia.pe",
      passwordHash,
      role: "ADMIN"
    }
  });

  const staffProfiles = [
    {
      displayName: "Ing. Carlos Medina",
      email: "ventas@icctopografia.pe",
      phone: "+51 999 111 222",
      roleTitle: "Asesor de instrumentacion y venta tecnica",
      department: "SALES" as const,
      specialties: ["Estaciones totales", "GNSS", "Compra B2B", "Cotizaciones"],
      tools: {
        whatsappTemplate: "Gracias por contactar a ICC Topografia. Para cotizar correctamente necesito confirmar aplicacion, ciudad, plazo y accesorios requeridos.",
        checklist: ["Validar aplicacion del equipo", "Confirmar stock/precio", "Revisar accesorios", "Coordinar cotizacion formal"],
        nextSteps: ["Preparar cotizacion comercial", "Enviar ficha tecnica", "Agendar asesoria de configuracion"]
      }
    },
    {
      displayName: "Ing. Valeria Rojas",
      email: "soporte@icctopografia.pe",
      phone: "+51 999 333 444",
      roleTitle: "Especialista en soporte, calibracion y mantenimiento",
      department: "TECHNICAL_SUPPORT" as const,
      specialties: ["Calibracion", "Mantenimiento", "Soporte tecnico", "Garantias"],
      tools: {
        whatsappTemplate: "Para revisar tu caso tecnico necesito modelo, serie, falla observada y fecha del ultimo mantenimiento.",
        checklist: ["Solicitar modelo y serie", "Registrar falla", "Determinar urgencia", "Coordinar diagnostico"],
        nextSteps: ["Crear ticket tecnico", "Enviar requisitos de recepcion", "Programar revision"]
      }
    },
    {
      displayName: "Ing. Diego Salazar",
      email: "proyectos@icctopografia.pe",
      phone: "+51 999 555 666",
      roleTitle: "Coordinador de servicios topograficos de campo",
      department: "FIELD_ENGINEERING" as const,
      specialties: ["Levantamiento", "Replanteo", "Georreferenciacion", "Control geometrico"],
      tools: {
        whatsappTemplate: "Para dimensionar el servicio necesito ubicacion, area aproximada, entregables requeridos y fecha objetivo.",
        checklist: ["Ubicacion del proyecto", "Alcance y entregables", "Restricciones de acceso", "Fecha de campo"],
        nextSteps: ["Definir alcance tecnico", "Estimar cuadrilla/equipos", "Enviar propuesta de servicio"]
      }
    }
  ];

  for (const profile of staffProfiles) {
    await prisma.staffProfile.upsert({
      where: { email: profile.email },
      update: profile,
      create: profile
    });
  }

  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: {
        name,
        slug: slugify(name),
        description: `Categoria tecnica para ${name.toLowerCase()}.`
      }
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: slugify(product.category) } });
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.slug.toUpperCase().replaceAll("-", "_"),
        brand: product.brand,
        model: product.model,
        summary: product.summary,
        description: product.description,
        price: product.price,
        stock: product.price ? 3 : 0,
        requiresQuote: !product.price,
        availability: product.availability,
        badge: product.badge,
        images: [],
        specifications: product.specs,
        categoryId: category.id
      }
    });
  }

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        title: service.title,
        slug: service.slug,
        summary: service.summary,
        content: service
      }
    });
  }

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }

  for (const [position, faq] of faqs.entries()) {
    await prisma.faq.create({ data: { ...faq, position } });
  }

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        content: { blocks: [{ type: "paragraph", text: post.excerpt }] },
        publishedAt: new Date()
      }
    });
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
