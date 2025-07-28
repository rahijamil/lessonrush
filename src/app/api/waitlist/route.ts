import { PrismaClient } from "@/generated/prisma";
import { z } from "zod";

const prisma = new PrismaClient();

const waitlistEntrySchema = z.object({
  email: z.email(),
  feedback: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = waitlistEntrySchema.parse(body);

    const entry = await prisma.waitlistEntry.upsert({
      where: { email: data.email },
      update: {
        // Only update feedback if it's provided and not empty
        ...(data.feedback &&
          data.feedback.trim() && { feedback: data.feedback }),
        // Only update painPoints if they're provided and not empty
        ...(data.painPoints &&
          data.painPoints.length > 0 && { painPoints: data.painPoints }),
      },
      create: {
        email: data.email,
        feedback: data.feedback ?? null,
        painPoints: data.painPoints ?? [],
      },
    });

    return new Response(JSON.stringify({ success: true, entry }), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid input",
          errors: error.issues,
        }),
        { status: 400 }
      );
    }

    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
