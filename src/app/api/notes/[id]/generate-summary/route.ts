import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { generateSummary } from "@/lib/ai";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    if (!note.content || note.content.trim() === "") {
      return NextResponse.json({ message: "Note content is empty" }, { status: 400 });
    }

    // Multi-provider AI call: Gemini → Groq → HuggingFace → Mock
    const result = await generateSummary(note.content, note.title);

    console.log(`[generate-summary] Used provider: ${result.provider}`);

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        summary: result.summary,
        actionItems: JSON.stringify(result.actionItems),
        // Only update title if AI suggested something different
        title: result.suggestedTitle !== note.title ? result.suggestedTitle : note.title,
      },
    });

    return NextResponse.json({ ...updatedNote, _provider: result.provider });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ message: "Error generating summary" }, { status: 500 });
  }
}
