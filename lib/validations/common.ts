import { z } from "zod";

export const idSchema = z.object({
  id: z.string().min(1)
});

export const slugParamSchema = z.object({
  slug: z.string().min(1)
});

export const optionalString = z.string().trim().optional().nullable();

export const jsonRecordSchema = z.record(z.unknown()).default({});
