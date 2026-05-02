"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { QuoteStatus, TicketCategory, TicketPriority } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function value(formData: FormData, key: string) {
  const input = formData.get(key);
  return typeof input === "string" && input.trim() ? input.trim() : undefined;
}

function listFromTextarea(formData: FormData, key: string) {
  return (value(formData, key) || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function requireClient() {
  const session = await auth();
  if (!session?.user?.email) redirect("/cuenta?callbackUrl=/portal");

  const client = await prisma.client.upsert({
    where: { email: session.user.email },
    update: { userId: session.user.id },
    create: {
      userId: session.user.id,
      name: session.user.name || session.user.email,
      email: session.user.email,
      contactName: session.user.name || session.user.email
    }
  });

  return { session, client };
}

function ticketCode() {
  const now = new Date();
  return `TK-${now.getFullYear()}-${String(now.getTime()).slice(-7)}`;
}

export async function updateClientProfileAction(formData: FormData) {
  const { client } = await requireClient();
  await prisma.client.update({
    where: { id: client.id },
    data: {
      name: value(formData, "name") || client.name,
      company: value(formData, "company"),
      document: value(formData, "document"),
      phone: value(formData, "phone"),
      address: value(formData, "address"),
      contactName: value(formData, "contactName")
    }
  });
  revalidatePath("/portal");
}

export async function createCustomerTicketAction(formData: FormData) {
  const { client } = await requireClient();
  const subject = value(formData, "subject");
  const description = value(formData, "description");
  if (!subject || !description) return;

  await prisma.ticket.create({
    data: {
      code: ticketCode(),
      clientId: client.id,
      customerName: client.name,
      customerEmail: client.email,
      company: client.company,
      subject,
      description,
      category: (value(formData, "category") as TicketCategory | undefined) || "TECHNICAL_QUERY",
      priority: (value(formData, "priority") as TicketPriority | undefined) || "MEDIUM",
      attachments: listFromTextarea(formData, "attachments"),
      messages: {
        create: {
          sender: "customer",
          body: description,
          files: listFromTextarea(formData, "attachments")
        }
      }
    }
  });
  revalidatePath("/portal");
  revalidatePath("/admin/tickets");
}

export async function replyCustomerTicketAction(ticketId: string, formData: FormData) {
  const { client } = await requireClient();
  const body = value(formData, "body");
  if (!body) return;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { clientId: true }
  });
  if (ticket?.clientId !== client.id) throw new Error("Ticket no disponible para este cliente.");

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "REVIEWING",
      messages: {
        create: {
          sender: "customer",
          body,
          files: listFromTextarea(formData, "files")
        }
      }
    }
  });
  revalidatePath("/portal");
  revalidatePath("/admin/tickets");
}

export async function respondPublicQuoteAction(token: string, status: QuoteStatus) {
  if (status !== "ACCEPTED" && status !== "REJECTED") return;
  const quote = await prisma.quote.update({
    where: { publicToken: token },
    data: {
      status,
      acceptedAt: status === "ACCEPTED" ? new Date() : null,
      rejectedAt: status === "REJECTED" ? new Date() : null
    },
    include: { sellerProfile: true, commissions: true }
  });

  if (status === "ACCEPTED" && quote.sellerProfileId && !quote.commissions.length) {
    const rate = Number(quote.sellerProfile?.commissionRate || 0);
    await prisma.commission.create({
      data: {
        quoteId: quote.id,
        sellerProfileId: quote.sellerProfileId,
        type: quote.sellerProfile?.commissionType || "SALE_PERCENTAGE",
        baseAmount: quote.total,
        rate,
        amount: Number(quote.total) * (rate / 100)
      }
    });
  }

  revalidatePath(`/cotizaciones/${token}`);
  revalidatePath("/portal");
  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin/ventas");
}

export async function respondPublicQuoteFromFormAction(token: string, formData: FormData) {
  const status = value(formData, "status") as QuoteStatus | undefined;
  if (!status) return;
  await respondPublicQuoteAction(token, status);
}
