import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentDetails } from "@/lib/payments/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago sends different notification types
    const { type, data } = body;

    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    // Fetch payment details from Mercado Pago
    const mpPayment = await getPaymentDetails(String(paymentId));

    const status = mpPayment.status;
    const externalReference = mpPayment.external_reference;

    if (!externalReference) {
      return NextResponse.json({ received: true });
    }

    let ref: { reportId: string; userId: string; productType: string };
    try {
      ref = JSON.parse(externalReference);
    } catch {
      console.error("Invalid external_reference:", externalReference);
      return NextResponse.json({ received: true });
    }

    const paymentStatus =
      status === "approved"
        ? "APPROVED"
        : status === "rejected" || status === "cancelled"
        ? "FAILED"
        : "PENDING";

    // Update payment record
    await prisma.payment.updateMany({
      where: {
        reportId: ref.reportId,
        provider: "MERCADOPAGO",
        status: "PENDING",
      },
      data: {
        providerPaymentId: String(paymentId),
        status: paymentStatus,
      },
    });

    // If approved, trigger report generation
    if (paymentStatus === "APPROVED") {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // We need the user's clerkId to call the generate endpoint
      // Instead, call the generation logic directly here
      const report = await prisma.report.findUnique({
        where: { id: ref.reportId },
        include: {
          user: {
            include: {
              lifeEvents: true,
              relatedPeople: true,
            },
          },
          payments: { where: { status: "APPROVED" } },
        },
      });

      if (report && report.status !== "COMPLETED" && report.status !== "PROCESSING") {
        // Fire and forget — trigger generation asynchronously
        fetch(`${appUrl}/api/reports/${ref.reportId}/generate-internal`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-internal-secret": process.env.INTERNAL_SECRET || "dev-secret" },
        }).catch(console.error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
