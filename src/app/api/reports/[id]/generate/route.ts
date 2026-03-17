import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateAnalysis } from "@/lib/analysis/engine";
import { sendReportEmail } from "@/lib/email/send-report";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        lifeEvents: true,
        relatedPeople: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const report = await prisma.report.findFirst({
      where: { id, userId: dbUser.id },
      include: { payments: { where: { status: "APPROVED" } } },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.payments.length === 0) {
      return NextResponse.json({ error: "Payment required" }, { status: 402 });
    }

    if (report.status === "COMPLETED") {
      return NextResponse.json({ message: "Report already generated" });
    }

    // Mark as processing
    await prisma.report.update({
      where: { id },
      data: { status: "PROCESSING" },
    });

    if (!dbUser.birthDate) {
      await prisma.report.update({
        where: { id },
        data: { status: "FAILED", errorMessage: "Birth date is required" },
      });
      return NextResponse.json({ error: "Birth date required" }, { status: 400 });
    }

    const analysisInput = {
      fullNameBirth: dbUser.fullNameBirth,
      currentName: dbUser.currentName,
      birthDate: dbUser.birthDate,
      birthTime: dbUser.birthTime,
      birthTimeAccuracy: dbUser.birthTimeAccuracy,
      birthCity: dbUser.birthCity,
      birthState: dbUser.birthState,
      birthCountry: dbUser.birthCountry,
      currentProfession: dbUser.currentProfession,
      currentCompany: dbUser.currentCompany,
      relationshipStatus: dbUser.relationshipStatus,
      financialStatus: dbUser.financialStatus,
      goals: dbUser.goals,
      challenges: dbUser.challenges,
      language: dbUser.language,
      tone: report.tone,
      depth: report.depth,
      includeWeekly: report.includeWeekly,
      includeTimeline: report.includeTimeline,
      includeRelational: report.includeRelational,
      lifeEvents: dbUser.lifeEvents.map(e => ({
        eventType: e.eventType,
        eventDate: e.eventDate,
        title: e.title,
        description: e.description,
        impactLevel: e.impactLevel,
      })),
      relatedPeople: dbUser.relatedPeople.map(p => ({
        fullName: p.fullName,
        relationType: p.relationType,
        birthDate: p.birthDate,
        notes: p.notes,
      })),
    };

    const inputSnapshot = { ...analysisInput, birthDate: dbUser.birthDate.toISOString() };

    const analysis = await generateAnalysis(analysisInput);

    await prisma.report.update({
      where: { id },
      data: {
        status: "COMPLETED",
        inputSnapshotJson: inputSnapshot,
        analysisJson: analysis as never,
      },
    });

    // Send email notification
    try {
      await sendReportEmail({
        to: dbUser.email,
        userName: dbUser.currentName,
        reportId: id,
        pdfUrl: null,
        language: dbUser.language,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: "Report generated successfully", reportId: id });
  } catch (error) {
    const { id } = await params;
    console.error("Error generating report:", error);
    await prisma.report.update({
      where: { id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    }).catch(console.error);

    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
