import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReportSchema = z.object({
  reportType: z.enum(["ESSENTIAL", "PREMIUM", "PREMIUM_RELATIONAL"]),
  tone: z.enum(["SPIRITUAL", "BALANCED", "RATIONAL"]).default("BALANCED"),
  depth: z.enum(["SUMMARY", "COMPLETE", "PREMIUM_DEPTH"]).default("COMPLETE"),
  includeWeekly: z.boolean().default(true),
  includeTimeline: z.boolean().default(true),
  includeRelational: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createReportSchema.parse(body);

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const report = await prisma.report.create({
      data: {
        userId: dbUser.id,
        reportType: data.reportType,
        tone: data.tone,
        depth: data.depth,
        includeWeekly: data.includeWeekly,
        includeTimeline: data.includeTimeline,
        includeRelational: data.includeRelational,
        status: "PENDING",
      },
    });

    return NextResponse.json({ reportId: report.id });
  } catch (error) {
    console.error("Error creating report:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        reports: {
          orderBy: { createdAt: "desc" },
          include: { payments: { where: { status: "APPROVED" } } },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ reports: [] });
    }

    return NextResponse.json({ reports: dbUser.reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
