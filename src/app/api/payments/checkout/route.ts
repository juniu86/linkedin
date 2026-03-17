import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createPaymentPreference, PRODUCT_PRICES } from "@/lib/payments/mercadopago";
import { z } from "zod";

const checkoutSchema = z.object({
  reportId: z.string(),
  productType: z.enum(["ESSENTIAL", "PREMIUM", "PREMIUM_RELATIONAL"]),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reportId, productType } = checkoutSchema.parse(body);

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const report = await prisma.report.findFirst({
      where: { id: reportId, userId: dbUser.id },
      include: { payments: { where: { status: "APPROVED" } } },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.payments.length > 0) {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const product = PRODUCT_PRICES[productType];
    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: dbUser.id,
        reportId,
        provider: "MERCADOPAGO",
        amount: product.amount,
        currency: "BRL",
        status: "PENDING",
        productType,
      },
    });

    // Create Mercado Pago preference
    const preference = await createPaymentPreference({
      reportId,
      userId: dbUser.id,
      productType,
      userEmail: dbUser.email,
      language: dbUser.language,
    });

    // Update payment with preference ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { preferenceId: preference.id },
    });

    return NextResponse.json({
      paymentId: payment.id,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
