import { z } from "zod";

export const serviceInputSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2).optional(),
  summary: z.string().trim().min(10),
  content: z.record(z.unknown()).default({}),
  isPublished: z.coerce.boolean().default(true)
});

export const serviceUpdateSchema = serviceInputSchema.partial();

export const postInputSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2).optional(),
  excerpt: z.string().trim().min(10),
  content: z.record(z.unknown()).default({}),
  author: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  metaTitle: z.string().trim().optional().nullable(),
  metaDesc: z.string().trim().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable()
});

export const postUpdateSchema = postInputSchema.partial();

export const faqInputSchema = z.object({
  question: z.string().trim().min(5),
  answer: z.string().trim().min(5),
  category: z.string().trim().optional().nullable(),
  position: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true)
});

export const faqUpdateSchema = faqInputSchema.partial();
