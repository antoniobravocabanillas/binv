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
