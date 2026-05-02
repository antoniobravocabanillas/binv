"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BotQuestionStatus, CommissionType, Prisma, Role, StaffDepartment, TechnicalAvailability, TicketCategory, TicketPriority, TicketStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/server/api";

function value(formData: FormData, key: string) {
  const input = formData.get(key);
  return typeof input === "string" && input.trim() ? input.trim() : undefined;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function contentFromText(formData: FormData) {
  const body = value(formData, "content") || value(formData, "body") || "";
  try {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" ? parsed : { body };
  } catch {
    return { body };
  }
}

function listFromTextarea(formData: FormData, key: string) {
  return (value(formData, key) || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function staffToolsFromForm(formData: FormData) {
  return {
    whatsappTemplate: value(formData, "whatsappTemplate") || "",
    checklist: listFromTextarea(formData, "checklist"),
    nextSteps: listFromTextarea(formData, "nextSteps")
  };
}

function staffCommercialFieldsFromForm(formData: FormData) {
  return {
    avatar: value(formData, "avatar"),
    commissionType: (value(formData, "commissionType") as CommissionType | undefined) || "SALE_PERCENTAGE",
    commissionRate: numberValue(formData, "commissionRate", 5),
    fixedCommission: numberValue(formData, "fixedCommission"),
    monthlyGoal: numberValue(formData, "monthlyGoal"),
    territory: value(formData, "territory"),
    internalNotes: value(formData, "internalNotes")
  };
}

function staffTechnicalFieldsFromForm(formData: FormData) {
  return {
    availability: (value(formData, "availability") as TechnicalAvailability | undefined) || "AVAILABLE",
    workZone: value(formData, "workZone"),
    experience: value(formData, "experience"),
    certifications: listFromTextarea(formData, "certifications"),
    documents: listFromTextarea(formData, "documents")
  };
}

async function requireActionRole(allowedRoles: Role[]) {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;

  if (!session?.user?.id || !role || !allowedRoles.includes(role)) {
    throw new Error("Permisos insuficientes.");
  }

  return { session, role };
}

function roleFromForm(formData: FormData) {
  const role = value(formData, "role") as Role | undefined;
  return role && ["TECHNICIAN", "SALES", "EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN", "SURVEYOR", "ENGINEER", "ARCHITECT", "SUPPORT"].includes(role) ? role : "SALES";
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const raw = value(formData, key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function dateValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw ? new Date(raw) : undefined;
}

function nullableValue(formData: FormData, key: string) {
  return value(formData, key) || null;
}

function ticketClosedAt(status?: string) {
  return status === "CLOSED" || status === "RESOLVED" ? new Date() : null;
}

async function upsertClientFromContact(formData: FormData) {
  const email = value(formData, "customerEmail") || value(formData, "email");
  const name = value(formData, "customerName") || value(formData, "name") || "Cliente sin nombre";
  if (!email) return null;

  return prisma.client.upsert({
    where: { email },
    update: {
      name,
      company: value(formData, "company"),
      phone: value(formData, "phone")
    },
    create: {
      name,
      email,
      company: value(formData, "company"),
      phone: value(formData, "phone"),
      contactName: name
    }
  });
}

export async function deleteLeadAction(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function updateLeadStatusAction(id: string, formData: FormData) {
  const status = value(formData, "status") as "NEW" | "CONTACTED" | "QUALIFIED" | "EVALUATION" | "QUOTED" | "NEGOTIATION" | "WON" | "LOST" | "REQUIRES_TECH_SUPPORT";
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

export async function updateLeadPipelineAction(id: string, formData: FormData) {
  await requireActionRole(["SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const assignedProfileId = value(formData, "assignedProfileId");
  await prisma.lead.update({
    where: { id },
    data: {
      status: value(formData, "status") as "NEW" | "CONTACTED" | "QUALIFIED" | "EVALUATION" | "QUOTED" | "NEGOTIATION" | "WON" | "LOST" | "REQUIRES_TECH_SUPPORT",
      priority: value(formData, "priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      assignedProfileId: assignedProfileId || null,
      interest: value(formData, "interest"),
      estimatedValue: numberValue(formData, "estimatedValue"),
      nextFollowUpAt: dateValue(formData, "nextFollowUpAt") || null
    }
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function createLeadNoteAction(id: string, formData: FormData) {
  const { session } = await requireActionRole(["SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const body = value(formData, "body");
  if (!body) return;
  await prisma.leadNote.create({
    data: {
      leadId: id,
      authorId: session.user.id,
      body
    }
  });
  revalidatePath("/admin/leads");
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const status = value(formData, "status") as "PENDING" | "QUOTED" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  const notes = value(formData, "notes");
  await prisma.order.update({ where: { id }, data: { status, notes } });
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function deleteOrderAction(id: string) {
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function createQuoteAction(formData: FormData) {
  await requireActionRole(["SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const client = await upsertClientFromContact(formData);
  const quantity = Math.max(numberValue(formData, "quantity", 1), 1);
  const unitPrice = numberValue(formData, "unitPrice");
  const discount = numberValue(formData, "discount");
  const subtotal = Math.max(quantity * unitPrice - discount, 0);
  const tax = numberValue(formData, "tax");
  const total = subtotal + tax;
  const now = new Date();
  const number = `COT-${now.getFullYear()}-${String(now.getTime()).slice(-7)}`;

  await prisma.quote.create({
    data: {
      number,
      clientId: client?.id,
      leadId: nullableValue(formData, "leadId"),
      sellerProfileId: nullableValue(formData, "sellerProfileId"),
      customerName: value(formData, "customerName") || client?.name || "",
      customerEmail: value(formData, "customerEmail") || client?.email,
      company: value(formData, "company") || client?.company,
      status: "DRAFT",
      currency: value(formData, "currency") || "USD",
      subtotal,
      discount,
      tax,
      total,
      validUntil: dateValue(formData, "validUntil"),
      terms: value(formData, "terms"),
      deliveryTime: value(formData, "deliveryTime"),
      observations: value(formData, "observations"),
      items: {
        create: {
          productId: nullableValue(formData, "productId"),
          type: value(formData, "itemType") || "product",
          description: value(formData, "description") || "Item comercial",
          quantity,
          unitPrice,
          discount,
          subtotal
        }
      }
    }
  });
  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin");
}

export async function updateQuoteStatusAction(id: string, formData: FormData) {
  await requireActionRole(["SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const status = value(formData, "status") as "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "CONVERTED";
  const quote = await prisma.quote.update({
    where: { id },
    data: {
      status,
      viewedAt: status === "VIEWED" ? new Date() : undefined,
      acceptedAt: status === "ACCEPTED" ? new Date() : undefined,
      rejectedAt: status === "REJECTED" ? new Date() : undefined
    },
    include: { sellerProfile: true, commissions: true }
  });

  if (status === "ACCEPTED" && quote.sellerProfileId && !quote.commissions.length) {
    const rate = Number(quote.sellerProfile?.commissionRate || 0);
    const amount = Number(quote.total) * (rate / 100);
    await prisma.commission.create({
      data: {
        quoteId: quote.id,
        sellerProfileId: quote.sellerProfileId,
        type: quote.sellerProfile?.commissionType || "SALE_PERCENTAGE",
        baseAmount: quote.total,
        rate,
        amount
      }
    });
  }

  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin/ventas");
  revalidatePath("/admin");
  if (quote.publicToken) revalidatePath(`/cotizaciones/${quote.publicToken}`);
}

export async function updateCommissionStatusAction(id: string, formData: FormData) {
  await requireActionRole(["ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const status = value(formData, "status") as "PENDING" | "APPROVED" | "PAID" | "CANCELLED";
  await prisma.commission.update({
    where: { id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
      notes: value(formData, "notes")
    }
  });
  revalidatePath("/admin/ventas");
}

export async function createFaqAction(formData: FormData) {
  await prisma.faq.create({
    data: {
      question: value(formData, "question") || "",
      answer: value(formData, "answer") || "",
      category: value(formData, "category"),
      position: Number(value(formData, "position") || 0),
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/faq");
}

export async function updateFaqAction(id: string, formData: FormData) {
  await prisma.faq.update({
    where: { id },
    data: {
      question: value(formData, "question") || "",
      answer: value(formData, "answer") || "",
      category: value(formData, "category"),
      position: Number(value(formData, "position") || 0),
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/faq");
}

export async function deleteFaqAction(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/contenidos");
  revalidatePath("/faq");
}

export async function createPostAction(formData: FormData) {
  const title = value(formData, "title") || "";
  const slug = value(formData, "slug") || slugify(title);
  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: value(formData, "excerpt") || "",
      content: contentFromText(formData) as Prisma.InputJsonValue,
      author: value(formData, "author"),
      category: value(formData, "category"),
      metaTitle: value(formData, "metaTitle"),
      metaDesc: value(formData, "metaDesc"),
      publishedAt: checked(formData, "isPublished") ? new Date() : null
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect(`/admin/contenidos?blogStatus=created&item=${encodeURIComponent(title)}`);
}

export async function updatePostAction(id: string, formData: FormData) {
  const title = value(formData, "title") || "";
  const slug = value(formData, "slug") || slugify(title);
  const previousPost = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true }
  });
  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: value(formData, "excerpt") || "",
      content: contentFromText(formData) as Prisma.InputJsonValue,
      author: value(formData, "author"),
      category: value(formData, "category"),
      metaTitle: value(formData, "metaTitle"),
      metaDesc: value(formData, "metaDesc"),
      publishedAt: checked(formData, "isPublished") ? new Date() : null
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (previousPost?.slug && previousPost.slug !== slug) {
    revalidatePath(`/blog/${previousPost.slug}`);
  }
  redirect(`/admin/contenidos?blogStatus=updated&item=${encodeURIComponent(title)}`);
}

export async function deletePostAction(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { title: true, slug: true }
  });
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/contenidos");
  revalidatePath("/blog");
  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`);
  }
  redirect(`/admin/contenidos?blogStatus=deleted&item=${encodeURIComponent(post?.title || "Post eliminado")}`);
}

export async function createServiceAction(formData: FormData) {
  const title = value(formData, "title") || "";
  await prisma.service.create({
    data: {
      title,
      slug: value(formData, "slug") || slugify(title),
      summary: value(formData, "summary") || "",
      content: contentFromText(formData) as Prisma.InputJsonValue,
      isPublished: checked(formData, "isPublished")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/servicios");
}

export async function updateServiceAction(id: string, formData: FormData) {
  const title = value(formData, "title") || "";
  await prisma.service.update({
    where: { id },
    data: {
      title,
      slug: value(formData, "slug") || slugify(title),
      summary: value(formData, "summary") || "",
      content: contentFromText(formData) as Prisma.InputJsonValue,
      isPublished: checked(formData, "isPublished")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/servicios");
}

export async function deleteServiceAction(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/contenidos");
  revalidatePath("/servicios");
}

export async function createTestimonialAction(formData: FormData) {
  await prisma.testimonial.create({
    data: {
      quote: value(formData, "quote") || "",
      author: value(formData, "author") || "",
      company: value(formData, "company"),
      role: value(formData, "role"),
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/");
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  await prisma.testimonial.update({
    where: { id },
    data: {
      quote: value(formData, "quote") || "",
      author: value(formData, "author") || "",
      company: value(formData, "company"),
      role: value(formData, "role"),
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/contenidos");
  revalidatePath("/");
}

export async function createBannerAction(formData: FormData) {
  await prisma.banner.create({
    data: {
      title: value(formData, "title") || "",
      subtitle: value(formData, "subtitle"),
      ctaLabel: value(formData, "ctaLabel"),
      ctaHref: value(formData, "ctaHref"),
      image: value(formData, "image"),
      placement: value(formData, "placement") || "home",
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/");
}

export async function updateBannerAction(id: string, formData: FormData) {
  await prisma.banner.update({
    where: { id },
    data: {
      title: value(formData, "title") || "",
      subtitle: value(formData, "subtitle"),
      ctaLabel: value(formData, "ctaLabel"),
      ctaHref: value(formData, "ctaHref"),
      image: value(formData, "image"),
      placement: value(formData, "placement") || "home",
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/contenidos");
  revalidatePath("/");
}

export async function deleteBannerAction(id: string) {
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/contenidos");
  revalidatePath("/");
}

export async function createCmsPageAction(formData: FormData) {
  const title = value(formData, "title") || "";
  await prisma.cmsPage.create({
    data: {
      title,
      slug: value(formData, "slug") || slugify(title),
      metaTitle: value(formData, "metaTitle"),
      metaDesc: value(formData, "metaDesc"),
      content: contentFromText(formData) as Prisma.InputJsonValue,
      isPublished: checked(formData, "isPublished")
    }
  });
  revalidatePath("/admin/contenidos");
}

export async function updateCmsPageAction(id: string, formData: FormData) {
  const title = value(formData, "title") || "";
  await prisma.cmsPage.update({
    where: { id },
    data: {
      title,
      slug: value(formData, "slug") || slugify(title),
      metaTitle: value(formData, "metaTitle"),
      metaDesc: value(formData, "metaDesc"),
      content: contentFromText(formData) as Prisma.InputJsonValue,
      isPublished: checked(formData, "isPublished")
    }
  });
  revalidatePath("/admin/contenidos");
}

export async function deleteCmsPageAction(id: string) {
  await prisma.cmsPage.delete({ where: { id } });
  revalidatePath("/admin/contenidos");
}

export async function takeChatConversationAction(id: string) {
  const { session } = await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const profile = session?.user?.id
    ? await prisma.staffProfile.findUnique({ where: { userId: session.user.id } })
    : null;

  await prisma.chatConversation.update({
    where: { id },
    data: {
      assignedToId: session?.user?.id || undefined,
      assignedProfileId: profile?.id || undefined
    }
  });
  revalidatePath("/admin/chat");
}

export async function assignChatProfileAction(id: string, formData: FormData) {
  await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const profileId = value(formData, "profileId");

  await prisma.chatConversation.update({
    where: { id },
    data: {
      assignedProfileId: profileId || null,
      assignedToId: undefined
    }
  });
  revalidatePath("/admin/chat");
}

export async function closeChatConversationAction(id: string) {
  const { session, role } = await requireActionRole(["TECHNICIAN", "SALES", "EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN", "SUPPORT"]);
  if (!["ADMIN", "EDITOR", "SUPER_ADMIN", "COMMERCIAL_ADMIN"].includes(role)) {
    const profile = await prisma.staffProfile.findUnique({ where: { userId: session.user.id } });
    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
      select: { assignedProfileId: true, assignedToId: true }
    });
    const canClose = conversation?.assignedToId === session.user.id || (profile?.id && conversation?.assignedProfileId === profile.id);
    if (!canClose) throw new Error("Este chat no esta asignado a tu perfil.");
  }
  await prisma.chatConversation.update({
    where: { id },
    data: { status: "CLOSED" }
  });
  revalidatePath("/admin/chat");
}

export async function deleteChatConversationAction(id: string) {
  await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  await prisma.chatConversation.delete({ where: { id } });
  revalidatePath("/admin/chat");
  revalidatePath("/admin");
}

export async function sendAdminChatMessageAction(id: string, formData: FormData) {
  const body = value(formData, "body");
  if (!body) return;
  const { session, role } = await requireActionRole(["TECHNICIAN", "SALES", "EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN", "SUPPORT"]);
  const profile = await prisma.staffProfile.findUnique({ where: { userId: session.user.id } });
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    select: { assignedProfileId: true, assignedToId: true }
  });
  const canManageAnyChat = ["ADMIN", "EDITOR", "SUPER_ADMIN", "COMMERCIAL_ADMIN"].includes(role);
  const canReply =
    canManageAnyChat ||
    conversation?.assignedToId === session.user.id ||
    (profile?.id && conversation?.assignedProfileId === profile.id);

  if (!canReply) throw new Error("Este chat no esta asignado a tu perfil.");

  await prisma.chatConversation.update({
    where: { id },
    data: {
      status: "ACTIVE",
      assignedToId: session?.user?.id || undefined,
      assignedProfileId: conversation?.assignedProfileId || profile?.id || undefined,
      messages: {
        create: {
          sender: "admin",
          body
        }
      }
    }
  });
  revalidatePath("/admin/chat");
}

export async function createStaffProfileAction(formData: FormData) {
  await requireActionRole(["ADMIN"]);
  await prisma.staffProfile.create({
    data: {
      displayName: value(formData, "displayName") || "",
      email: value(formData, "email"),
      phone: value(formData, "phone"),
      roleTitle: value(formData, "roleTitle") || "",
      department: (value(formData, "department") as StaffDepartment | undefined) || "SALES",
      ...staffCommercialFieldsFromForm(formData),
      specialties: listFromTextarea(formData, "specialties"),
      tools: staffToolsFromForm(formData) as Prisma.InputJsonValue,
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/chat");
}

export async function updateStaffProfileAction(id: string, formData: FormData) {
  await requireActionRole(["ADMIN"]);
  await prisma.staffProfile.update({
    where: { id },
    data: {
      displayName: value(formData, "displayName") || "",
      email: value(formData, "email"),
      phone: value(formData, "phone"),
      roleTitle: value(formData, "roleTitle") || "",
      department: (value(formData, "department") as StaffDepartment | undefined) || "SALES",
      ...staffCommercialFieldsFromForm(formData),
      specialties: listFromTextarea(formData, "specialties"),
      tools: staffToolsFromForm(formData) as Prisma.InputJsonValue,
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/chat");
}

export async function updateSellerCommercialAction(id: string, formData: FormData) {
  await requireActionRole(["ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  await prisma.staffProfile.update({
    where: { id },
    data: staffCommercialFieldsFromForm(formData)
  });
  revalidatePath("/admin/ventas");
  revalidatePath("/admin/equipo");
}

export async function createProjectAction(formData: FormData) {
  await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN"]);
  const title = value(formData, "title") || "";
  await prisma.project.create({
    data: {
      title,
      slug: value(formData, "slug") || slugify(title),
      clientName: value(formData, "clientName"),
      location: value(formData, "location"),
      category: value(formData, "category"),
      servicesApplied: listFromTextarea(formData, "servicesApplied"),
      summary: value(formData, "summary") || "",
      description: value(formData, "description") || "",
      challenge: value(formData, "challenge"),
      solution: value(formData, "solution"),
      results: value(formData, "results"),
      status: (value(formData, "status") as "PLANNING" | "IN_PROGRESS" | "FINISHED" | "PUBLISHED" | "ARCHIVED") || "PLANNING",
      isPublic: checked(formData, "isPublic"),
      isFeatured: checked(formData, "isFeatured"),
      images: {
        create: listFromTextarea(formData, "images").map((url, position) => ({ url, position, alt: title }))
      }
    }
  });
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN"]);
  const title = value(formData, "title") || "";
  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug: value(formData, "slug") || slugify(title),
      clientName: value(formData, "clientName"),
      location: value(formData, "location"),
      category: value(formData, "category"),
      servicesApplied: listFromTextarea(formData, "servicesApplied"),
      summary: value(formData, "summary") || "",
      description: value(formData, "description") || "",
      challenge: value(formData, "challenge"),
      solution: value(formData, "solution"),
      results: value(formData, "results"),
      status: (value(formData, "status") as "PLANNING" | "IN_PROGRESS" | "FINISHED" | "PUBLISHED" | "ARCHIVED") || "PLANNING",
      isPublic: checked(formData, "isPublic"),
      isFeatured: checked(formData, "isFeatured")
    }
  });
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
}

export async function deleteProjectAction(id: string) {
  await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN"]);
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
}

export async function createProjectProgressAction(projectId: string, formData: FormData) {
  const { session } = await requireActionRole(["SURVEYOR", "ENGINEER", "ARCHITECT", "SUPPORT", "EDITOR", "ADMIN", "SUPER_ADMIN"]);
  const title = value(formData, "title");
  const body = value(formData, "body");
  if (!title || !body) return;
  const profile = await prisma.staffProfile.findUnique({ where: { userId: session.user.id } });

  await prisma.projectProgress.create({
    data: {
      projectId,
      staffProfileId: profile?.id,
      title,
      body,
      milestone: value(formData, "milestone"),
      files: listFromTextarea(formData, "files")
    }
  });
  revalidatePath("/admin/proyectos");
  revalidatePath("/admin/tecnicos");
}

export async function updateTechnicalProfileAction(id: string, formData: FormData) {
  await requireActionRole(["ADMIN", "SUPER_ADMIN", "ENGINEER"]);
  await prisma.staffProfile.update({
    where: { id },
    data: {
      roleTitle: value(formData, "roleTitle") || "",
      phone: value(formData, "phone"),
      department: (value(formData, "department") as StaffDepartment | undefined) || "FIELD_ENGINEERING",
      specialties: listFromTextarea(formData, "specialties"),
      ...staffTechnicalFieldsFromForm(formData),
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/tecnicos");
  revalidatePath("/admin/equipo");
}

export async function updateTicketAction(id: string, formData: FormData) {
  await requireActionRole(["SUPPORT", "TECHNICIAN", "SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const status = (value(formData, "status") as TicketStatus | undefined) || "OPEN";
  await prisma.ticket.update({
    where: { id },
    data: {
      status,
      priority: (value(formData, "priority") as TicketPriority | undefined) || "MEDIUM",
      category: (value(formData, "category") as TicketCategory | undefined) || "TECHNICAL_QUERY",
      assignedProfileId: nullableValue(formData, "assignedProfileId"),
      closedAt: ticketClosedAt(status)
    }
  });
  revalidatePath("/admin/tickets");
  revalidatePath("/portal");
  revalidatePath("/admin");
}

export async function sendTicketMessageAction(id: string, formData: FormData) {
  const body = value(formData, "body");
  if (!body) return;
  const { session } = await requireActionRole(["SUPPORT", "TECHNICIAN", "SALES", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);

  await prisma.ticket.update({
    where: { id },
    data: {
      status: "WAITING_CUSTOMER",
      messages: {
        create: {
          authorId: session.user.id,
          sender: "staff",
          body,
          files: listFromTextarea(formData, "files")
        }
      }
    }
  });
  revalidatePath("/admin/tickets");
  revalidatePath("/portal");
}

export async function createInternalChannelAction(formData: FormData) {
  await requireActionRole(["ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const name = value(formData, "name");
  if (!name) return;
  await prisma.internalChatChannel.upsert({
    where: { slug: value(formData, "slug") || slugify(name) },
    update: {
      name,
      description: value(formData, "description")
    },
    create: {
      name,
      slug: value(formData, "slug") || slugify(name),
      description: value(formData, "description")
    }
  });
  revalidatePath("/admin/chat-interno");
}

export async function sendInternalMessageAction(channelId: string, formData: FormData) {
  const body = value(formData, "body");
  if (!body) return;
  const { session } = await requireActionRole(["TECHNICIAN", "SALES", "EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN", "SURVEYOR", "ENGINEER", "ARCHITECT", "SUPPORT"]);
  await prisma.internalChatMessage.create({
    data: {
      channelId,
      userId: session.user.id,
      body,
      files: listFromTextarea(formData, "files"),
      leadId: nullableValue(formData, "leadId"),
      projectId: nullableValue(formData, "projectId"),
      ticketId: nullableValue(formData, "ticketId")
    }
  });
  revalidatePath("/admin/chat-interno");
}

export async function reviewBotQuestionAction(id: string, formData: FormData) {
  await requireActionRole(["EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN"]);
  const status = (value(formData, "status") as BotQuestionStatus | undefined) || "PENDING";
  const question = await prisma.botUnansweredQuestion.update({
    where: { id },
    data: {
      status,
      answer: value(formData, "answer"),
      category: value(formData, "category")
    }
  });

  if (status === "APPROVED" && question.answer) {
    await prisma.faq.create({
      data: {
        question: question.question,
        answer: question.answer,
        category: question.category || "atencion",
        origin: "chatbot",
        approved: true,
        active: true
      }
    });
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/admin/contenidos");
  revalidatePath("/faq");
}

export async function markNotificationReadAction(id: string) {
  const { session } = await requireActionRole(["TECHNICIAN", "SALES", "EDITOR", "ADMIN", "SUPER_ADMIN", "COMMERCIAL_ADMIN", "SURVEYOR", "ENGINEER", "ARCHITECT", "SUPPORT"]);
  await prisma.notification.updateMany({
    where: { id, OR: [{ userId: session.user.id }, { userId: null }] },
    data: { readAt: new Date() }
  });
  revalidatePath("/admin/notificaciones");
}

export async function deleteStaffProfileAction(id: string) {
  await requireActionRole(["ADMIN"]);
  await prisma.staffProfile.delete({ where: { id } });
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/chat");
}

export async function upsertStaffAccessAction(profileId: string, formData: FormData) {
  await requireActionRole(["ADMIN"]);

  const profile = await prisma.staffProfile.findUnique({
    where: { id: profileId },
    include: { user: true }
  });
  if (!profile) throw new Error("Perfil no encontrado.");

  const email = value(formData, "accessEmail") || profile.email;
  const temporaryPassword = value(formData, "temporaryPassword");
  const role = roleFromForm(formData);
  if (!email) throw new Error("El correo de acceso es obligatorio.");

  const data: Prisma.UserUpdateInput = {
    name: profile.displayName,
    email,
    role
  };

  if (temporaryPassword) {
    data.passwordHash = await bcrypt.hash(temporaryPassword, 12);
  }

  let userId = profile.userId;
  if (profile.userId) {
    await prisma.user.update({ where: { id: profile.userId }, data });
  } else {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      await prisma.user.update({ where: { id: existingUser.id }, data });
      userId = existingUser.id;
    } else {
      if (!temporaryPassword) throw new Error("La contraseña temporal es obligatoria para crear un acceso nuevo.");
      const user = await prisma.user.create({
        data: {
          name: profile.displayName,
          email,
          passwordHash: await bcrypt.hash(temporaryPassword, 12),
          role
        }
      });
      userId = user.id;
    }
  }

  await prisma.staffProfile.update({
    where: { id: profileId },
    data: {
      userId,
      email: profile.email || email
    }
  });
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/chat");
}

export async function unlinkStaffAccessAction(profileId: string) {
  await requireActionRole(["ADMIN"]);
  await prisma.staffProfile.update({
    where: { id: profileId },
    data: { userId: null }
  });
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/chat");
}
