import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { categories, products } from "../lib/content/products";
import { faqs, posts, testimonials } from "../lib/content/site";
import { services } from "../lib/content/services";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin12345!", 12);
  const clientPasswordHash = await bcrypt.hash("Cliente12345!", 12);
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
      commissionType: "SALE_PERCENTAGE" as const,
      commissionRate: 5,
      monthlyGoal: 60000,
      territory: "Lima Metropolitana y cuentas B2B",
      availability: "AVAILABLE" as const,
      workZone: "Lima y provincias",
      experience: "12 anos en venta tecnica B2B",
      certifications: ["Instrumentacion topografica", "Asesoria GNSS"],
      documents: [],
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
      commissionType: "FIXED_AMOUNT" as const,
      commissionRate: 0,
      fixedCommission: 0,
      monthlyGoal: 0,
      territory: "Soporte nacional",
      availability: "AVAILABLE" as const,
      workZone: "Laboratorio y soporte remoto",
      experience: "8 anos en mantenimiento y calibracion",
      certifications: ["Calibracion de niveles", "Diagnostico de estaciones totales"],
      documents: [],
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
      commissionType: "SALE_PERCENTAGE" as const,
      commissionRate: 3,
      monthlyGoal: 45000,
      territory: "Servicios de campo",
      availability: "FIELD" as const,
      workZone: "Costa central",
      experience: "10 anos en control y replanteo de obra",
      certifications: ["Geodesia aplicada", "Control geometrico QA/QC"],
      documents: [],
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

  const internalChannels = [
    { name: "General", slug: "general", description: "Coordinacion transversal del equipo ICC." },
    { name: "Ventas", slug: "ventas", description: "Leads, cotizaciones, seguimiento y cierres." },
    { name: "Operaciones", slug: "operaciones", description: "Campo, gabinete y proyectos." },
    { name: "Soporte", slug: "soporte", description: "Tickets, calibracion, reparacion y garantias." },
    { name: "Proyectos", slug: "proyectos", description: "Avances, entregables y coordinacion tecnica." }
  ];

  for (const channel of internalChannels) {
    await prisma.internalChatChannel.upsert({
      where: { slug: channel.slug },
      update: channel,
      create: channel
    });
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

  const clientUser = await prisma.user.upsert({
    where: { email: "operaciones@urbania-demo.pe" },
    update: {
      passwordHash: clientPasswordHash,
      role: "CUSTOMER"
    },
    create: {
      name: "Mariana Torres",
      email: "operaciones@urbania-demo.pe",
      passwordHash: clientPasswordHash,
      role: "CUSTOMER"
    }
  });

  const client = await prisma.client.upsert({
    where: { email: "operaciones@urbania-demo.pe" },
    update: { userId: clientUser.id },
    create: {
      userId: clientUser.id,
      name: "Mariana Torres",
      company: "Urbania Capital Demo",
      email: "operaciones@urbania-demo.pe",
      phone: "+51 988 220 440",
      status: "cliente activo",
      contactName: "Mariana Torres"
    }
  });

  const seller = await prisma.staffProfile.findUnique({ where: { email: "ventas@icctopografia.pe" } });
  const lead = await prisma.lead.upsert({
    where: { id: "seed-lead-urbania" },
    update: {},
    create: {
      id: "seed-lead-urbania",
      clientId: client.id,
      assignedProfileId: seller?.id,
      name: "Mariana Torres",
      email: "operaciones@urbania-demo.pe",
      phone: "+51 988 220 440",
      company: "Urbania Capital Demo",
      message: "Necesitamos replanteo, control semanal y entregables para avance de obra.",
      source: "web",
      interest: "Servicio de control topografico",
      priority: "HIGH",
      estimatedValue: 18500,
      status: "NEGOTIATION"
    }
  });

  await prisma.quote.upsert({
    where: { number: "COT-2026-0001" },
    update: { publicToken: "cot-demo-urbania-2026" },
    create: {
      number: "COT-2026-0001",
      publicToken: "cot-demo-urbania-2026",
      clientId: client.id,
      leadId: lead.id,
      sellerProfileId: seller?.id,
      customerName: client.name,
      customerEmail: client.email,
      company: client.company,
      status: "SENT",
      subtotal: 18500,
      total: 18500,
      terms: "50% al inicio, saldo contra entrega de informe tecnico.",
      deliveryTime: "Inicio en 72 horas despues de orden de servicio.",
      items: {
        create: {
          type: "service",
          description: "Control topografico semanal y reportes de avance",
          quantity: 1,
          unitPrice: 18500,
          subtotal: 18500
        }
      }
    }
  });

  await prisma.project.upsert({
    where: { slug: "control-topografico-corredor-vial-demo" },
    update: {},
    create: {
      title: "Control topografico para corredor vial demo",
      slug: "control-topografico-corredor-vial-demo",
      clientId: client.id,
      clientName: client.company,
      location: "Lima, Peru",
      category: "Infraestructura vial",
      servicesApplied: ["Control geometrico", "Replanteo", "Reportes QA/QC"],
      summary: "Red de control, replanteo de ejes y reportes semanales para avance de obra.",
      description: "Implementacion de puntos de control, verificacion de ejes, niveles y comparativos contra expediente tecnico para reducir retrabajos.",
      challenge: "Coordinar mediciones con ventanas operativas cortas y mantener trazabilidad entre campo y gabinete.",
      solution: "Se definio una red de control, protocolo de levantamiento y entregables semanales con evidencia fotografica y cuadros de desviacion.",
      results: "42 km controlados",
      status: "PUBLISHED",
      isPublic: true,
      isFeatured: true
    }
  });

  await prisma.clientDocument.upsert({
    where: { id: "seed-client-document-urbania" },
    update: {},
    create: {
      id: "seed-client-document-urbania",
      clientId: client.id,
      title: "Propuesta tecnica de control topografico",
      type: "cotizacion",
      url: "/brochure-ayb-topografia.pdf"
    }
  });

  const support = await prisma.staffProfile.findUnique({ where: { email: "soporte@icctopografia.pe" } });
  await prisma.ticket.upsert({
    where: { code: "TK-2026-0001" },
    update: {},
    create: {
      code: "TK-2026-0001",
      clientId: client.id,
      assignedProfileId: support?.id,
      customerName: client.name,
      customerEmail: client.email,
      company: client.company,
      subject: "Revision preventiva de estacion total",
      category: "CALIBRATION",
      priority: "HIGH",
      status: "REVIEWING",
      description: "Solicitamos agenda para calibracion y verificacion antes de iniciar obra.",
      attachments: [],
      messages: {
        create: [
          {
            sender: "customer",
            body: "Necesitamos confirmar disponibilidad para calibracion esta semana.",
            files: []
          },
          {
            sender: "staff",
            body: "Recibido. Validaremos agenda de laboratorio y requisitos de recepcion del equipo.",
            files: []
          }
        ]
      }
    }
  });

  await prisma.botUnansweredQuestion.upsert({
    where: { question: "Que incluye una calibracion de estacion total?" },
    update: {},
    create: {
      question: "Que incluye una calibracion de estacion total?",
      answer: "Incluye revision funcional, verificacion de precision, diagnostico, ajustes necesarios y recomendaciones de uso.",
      category: "calibracion",
      source: "demo",
      frequency: 3
    }
  });

  await prisma.notification.create({
    data: {
      type: "SYSTEM",
      title: "Fase 3 activa",
      body: "Chat interno, chatbot local, FAQ dinamica, reportes y notificaciones estan disponibles.",
      href: "/admin/reportes"
    }
  });
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
