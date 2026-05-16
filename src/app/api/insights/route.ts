import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // All non-archived notes
    const notes = await prisma.note.findMany({
      where: { userId, isArchived: false },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        tags: true,
        summary: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    // Total counts
    const totalNotes = notes.length;
    const aiGeneratedCount = notes.filter((n) => n.summary).length;
    const sharedCount = await prisma.note.count({
      where: { userId, shareId: { not: null } },
    });

    // Recently edited (top 5)
    const recentNotes = notes.slice(0, 5).map((n) => ({
      id: n.id,
      title: n.title,
      updatedAt: n.updatedAt,
    }));

    // Most-used tags
    const tagMap: Record<string, number> = {};
    for (const note of notes) {
      if (!note.tags) continue;
      note.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .forEach((tag) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
    }
    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));

    // Weekly activity — notes edited per day (last 7 days, Mon=0..Sun=6)
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon → Sun
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (const note of notes) {
      if (note.updatedAt < sevenDaysAgo) continue;
      const day = note.updatedAt.getDay(); // 0=Sun..6=Sat
      const idx = day === 0 ? 6 : day - 1; // Shift to Mon=0..Sun=6
      dayCounts[idx]++;
    }

    return NextResponse.json({
      totalNotes,
      aiGeneratedCount,
      sharedCount,
      recentNotes,
      topTags,
      weeklyActivity: {
        days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        counts: dayCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json({ message: "Error fetching insights" }, { status: 500 });
  }
}
