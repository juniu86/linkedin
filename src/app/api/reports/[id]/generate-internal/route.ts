import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAnalysis } from "@/lib/analysis/engine";
import { sendReportEmail } from "@/lib/email/send-report";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate internal secret
  const secret = req.headers.get("x-internal-secret");
  if (secret !== (process.env.INTERNAL_SECRET || "dev-secret")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          include: { lifeEvents: true, relatedPeople: true },
        },
        payments: { where: { status: "APPROVED" } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.payments.length === 0) {
      return NextResponse.json({ error: "Payment required" }, { status: 402 });
    }

    if (report.status === "COMPLETED") {
      return NextResponse.json({ message: "Already completed" });
    }

    const user = report.user;
    if (!user.birthDate) {
      await prisma.report.update({
        where: { id },
        data: { status: "FAILED", errorMessage: "Birth date missing" },
      });
      return NextResponse.json({ error: "Birth date required" }, { status: 400 });
    }

    await prisma.report.update({ where: { id }, data: { status: "PROCESSING" } });

    const analysisInput = {
      fullNameBirth: user.fullNameBirth,
      currentName: user.currentName,
      birthDate: user.birthDate,
      birthTime: user.birthTime,
      birthTimeAccuracy: user.birthTimeAccuracy,
      birthCity: user.birthCity,
      birthState: user.birthState,
      birthCountry: user.birthCountry,
      currentProfession: user.currentProfession,
      currentCompany: user.currentCompany,
      relationshipStatus: user.relationshipStatus,
      financialStatus: user.financialStatus,
      goals: user.goals,
      challenges: user.challenges,
      language: user.language,
      tone: report.tone,
      depth: report.depth,
      includeWeekly: report.includeWeekly,
      includeTimeline: report.includeTimeline,
      includeRelational: report.includeRelational,
      lifeEvents: user.lifeEvents.map(e => ({
        eventType: e.eventType,
        eventDate: e.eventDate,
        title: e.title,
        description: e.description,
        impactLevel: e.impactLevel,
      })),
      relatedPeople: user.relatedPeople.map(p => ({
        fullName: p.fullName,
        relationType: p.relationType,
        birthDate: p.birthDate,
        notes: p.notes,
      })),
    };

    const analysis = await generateAnalysis(analysisInput);

    await prisma.report.update({
      where: { id },
      data: {
        status: "COMPLETED",
        inputSnapshotJson: { ...analysisInput, birthDate: user.birthDate.toISOString() },
        analysisJson: analysis as never,
      },
    });

    try {
      await sendReportEmail({
        to: user.email,
        userName: user.currentName,
        reportId: id,
        language: user.language,
      });
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Internal generate error:", error);
    await prisma.report.update({
      where: { id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown",
      },
    }).catch(console.error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
