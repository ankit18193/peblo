import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
        ...(search ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } }
          ]
        } : {}),
        ...(tag ? { tags: { contains: tag } } : {})
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, tags } = await request.json();

    const note = await prisma.note.create({
      data: {
        title: title || "Untitled",
        content: content || "",
        tags: tags || "",
        userId: session.user.id
      }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating note" }, { status: 500 });
  }
}
