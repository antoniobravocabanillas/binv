import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  message: z.string().trim().min(10),
  intent: z.string().trim().optional(),
  context: z.string().trim().optional(),
  subject: z.string().trim().optional()
});

export const leadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  message: z.string().trim().min(10),
  intent: z.string().trim().optional(),
  context: z.string().trim().optional(),
  subject: z.string().trim().optional()
});

export const leadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"])
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().trim().min(2),
  document: z.string().trim().optional(),
  phone: z.string().trim().optional()
});
