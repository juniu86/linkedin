import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const report = await prisma.report.findFirst({
      where: { id, userId: dbUser.id },
      include: {
        payments: { where: { status: "APPROVED" } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const isPaid = report.payments.length > 0;

    if (!isPaid) {
      // Return teaser only
      return NextResponse.json({
        report: {
          id: report.id,
          reportType: report.reportType,
          status: report.status,
          isPaid: false,
          teaser: report.analysisJson
            ? {
                executiveSummary: (report.analysisJson as Record<string, unknown>).executiveSummary,
                essence: (report.analysisJson as Record<string, unknown>).essence,
                weeklyForecast: {
                  weekGuidePhrase: ((report.analysisJson as Record<string, unknown>).weeklyForecast as Record<string, unknown>)?.weekGuidePhrase,
                },
              }
            : null,
          createdAt: report.createdAt,
        },
      });
    }

    return NextResponse.json({
      report: {
        ...report,
        isPaid: true,
      },
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
