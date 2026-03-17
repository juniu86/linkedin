import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  fullNameBirth: z.string().min(2),
  currentName: z.string().min(2),
  phone: z.string().optional(),
  gender: z.string().optional(),
  language: z.string().default("pt"),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthTimeAccuracy: z.enum(["EXACT", "APPROXIMATE", "UNKNOWN"]).default("UNKNOWN"),
  birthCity: z.string().optional(),
  birthState: z.string().optional(),
  birthCountry: z.string().optional(),
  currentProfession: z.string().optional(),
  currentCompany: z.string().optional(),
  relationshipStatus: z.string().optional(),
  financialStatus: z.string().optional(),
  goals: z.string().optional(),
  challenges: z.string().optional(),
  formDraftJson: z.record(z.string(), z.unknown()).optional(),
  lifeEvents: z
    .array(
      z.object({
        id: z.string().optional(),
        eventType: z.string(),
        eventDate: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        impactLevel: z.number().min(1).max(10).default(5),
      })
    )
    .optional(),
  relatedPeople: z
    .array(
      z.object({
        id: z.string().optional(),
        fullName: z.string(),
        relationType: z.string(),
        birthDate: z.string().optional(),
        birthTime: z.string().optional(),
        birthCity: z.string().optional(),
        birthState: z.string().optional(),
        birthCountry: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { lifeEvents: true, relatedPeople: true },
    });

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "";

    const body = await req.json();
    const data = profileSchema.parse(body);

    const { lifeEvents, relatedPeople, formDraftJson, ...profileData } = data;

    const upsertData = {
      ...profileData,
      clerkId: userId,
      email,
      birthDate: profileData.birthDate ? new Date(profileData.birthDate) : undefined,
      formDraftJson: (formDraftJson ?? undefined) as never,
    };

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: upsertData,
      create: {
        ...upsertData,
        fullNameBirth: data.fullNameBirth,
        currentName: data.currentName,
      },
    });

    // Sync life events
    if (lifeEvents !== undefined) {
      await prisma.lifeEvent.deleteMany({ where: { userId: user.id } });
      if (lifeEvents.length > 0) {
        await prisma.lifeEvent.createMany({
          data: lifeEvents.map(e => ({
            userId: user.id,
            eventType: e.eventType as Parameters<typeof prisma.lifeEvent.create>[0]["data"]["eventType"],
            eventDate: e.eventDate ? new Date(e.eventDate) : null,
            title: e.title,
            description: e.description || null,
            impactLevel: e.impactLevel,
          })),
        });
      }
    }

    // Sync related people
    if (relatedPeople !== undefined) {
      await prisma.relatedPerson.deleteMany({ where: { userId: user.id } });
      if (relatedPeople.length > 0) {
        await prisma.relatedPerson.createMany({
          data: relatedPeople.map(p => ({
            userId: user.id,
            fullName: p.fullName,
            relationType: p.relationType,
            birthDate: p.birthDate ? new Date(p.birthDate) : null,
            birthTime: p.birthTime || null,
            birthCity: p.birthCity || null,
            birthState: p.birthState || null,
            birthCountry: p.birthCountry || null,
            notes: p.notes || null,
          })),
        });
      }
    }

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
