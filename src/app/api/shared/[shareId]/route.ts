import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  try {
    const note = await prisma.note.findUnique({
      where: { shareId },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    if (!note || note.isArchived) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching shared note" }, { status: 500 });
  }
}
