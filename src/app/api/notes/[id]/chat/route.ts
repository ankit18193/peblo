import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { chatWithNote } from "@/lib/ai";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const { message } = await request.json();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!message?.trim()) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 });
  }

  try {
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    // Multi-provider AI call: Gemini → Groq → HuggingFace
    const result = await chatWithNote(
      note.title,
      note.content,
      note.summary,
      message
    );

    console.log(`[chat] Used provider: ${result.provider}`);

    return NextResponse.json({ response: result.response, provider: result.provider });
  } catch (error) {
    console.error("Error in AI Chat:", error);
    return NextResponse.json({ message: "Error in AI Chat" }, { status: 500 });
  }
}
