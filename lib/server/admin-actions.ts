"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, Role, StaffDepartment } from "@prisma/client";
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
  return role && ["TECHNICIAN", "SALES", "EDITOR", "ADMIN"].includes(role) ? role : "SALES";
}

export async function deleteLeadAction(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function updateLeadStatusAction(id: string, formData: FormData) {
  const status = value(formData, "status") as "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";
  await prisma.lead.update({ where: { id }, data: { status } });
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
  const { session } = await requireActionRole(["EDITOR", "ADMIN"]);
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
  await requireActionRole(["EDITOR", "ADMIN"]);
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
  const { session, role } = await requireActionRole(["TECHNICIAN", "SALES", "EDITOR", "ADMIN"]);
  if (role !== "ADMIN" && role !== "EDITOR") {
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
  await requireActionRole(["EDITOR", "ADMIN"]);
  await prisma.chatConversation.delete({ where: { id } });
  revalidatePath("/admin/chat");
  revalidatePath("/admin");
}

export async function sendAdminChatMessageAction(id: string, formData: FormData) {
  const body = value(formData, "body");
  if (!body) return;
  const { session, role } = await requireActionRole(["TECHNICIAN", "SALES", "EDITOR", "ADMIN"]);
  const profile = await prisma.staffProfile.findUnique({ where: { userId: session.user.id } });
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    select: { assignedProfileId: true, assignedToId: true }
  });
  const canManageAnyChat = role === "ADMIN" || role === "EDITOR";
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
      specialties: listFromTextarea(formData, "specialties"),
      tools: staffToolsFromForm(formData) as Prisma.InputJsonValue,
      active: checked(formData, "active")
    }
  });
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/chat");
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
