"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  MoreVertical,
  LayoutGrid,
  List,
  SortDesc,
  CheckSquare,
  Square,
  PenLine,
} from "lucide-react";

import { format, formatDistanceToNow } from "date-fns";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function AllNotes() {
  const { status } = useSession();
  const router = useRouter();
  const { searchQuery, activeFolder, activeTag } = useWorkspace();

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = (note.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (note.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = activeTag ? (note.tags || "").toLowerCase().includes(activeTag.toLowerCase()) : true;
    
    // Mock folder logic since it's not in DB
    const matchesFolder = activeFolder === "all" || 
                         (activeFolder === "Work" && (note.tags || "").toLowerCase().includes("work")) ||
                         (activeFolder === "Personal" && (note.tags || "").toLowerCase().includes("personal")) ||
                         (activeFolder === "Projects" && (note.tags || "").toLowerCase().includes("project"));
                         
    return matchesSearch && matchesTag && matchesFolder;
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchNotes();
    }
  }, [status]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/notes`);

      if (res.ok) {
        const data = await res.json();
        setNotes(data.filter((n: any) => !n.isArchived));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: Date) => {
    const distance = formatDistanceToNow(date, {
      addSuffix: true,
    });

    if (
      distance.includes("less than a minute") ||
      distance.includes("minute")
    ) {
      return "Just now";
    }

    if (distance.includes("hour")) {
      return distance
        .replace("about ", "")
        .replace(" hours", "h")
        .replace(" hour", "h");
    }

    if (distance.includes("day")) {
      return distance.includes("1 day")
        ? "Yesterday"
        : format(date, "MMM d");
    }

    return format(date, "MMM d");
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{
            borderColor: "var(--primary)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="mx-auto pb-12 px-6 lg:px-10 overflow-x-hidden"
      style={{
        maxWidth: "1180px",
        animation: "fadeIn 0.45s ease-out forwards",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(16px);
              }
              to {
                opacity: 1;
                transform: translateY(0px);
              }
            }

            @keyframes popIn {
              from {
                opacity: 0;
                transform: scale(0.96);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `,
        }}
      />

      {/* HEADER */}
      <div
        className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-10 pb-6"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          animation: "slideUp 0.5s ease-out forwards",
        }}
      >
        {/* LEFT */}
        <div>
          <h1
            className="font-bold tracking-tight mb-2"
            style={{
              fontSize: "3rem",
              lineHeight: "1",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "-0.04em",
            }}
          >
            Work Notes
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Showing {filteredNotes.length} notes {activeFolder !== 'all' ? `in ${activeFolder}` : ''} {activeTag ? `with #${activeTag}` : ''}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-5">
          {/* GRID/LIST */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(0,245,212,0.08)",
                border: "1px solid rgba(0,245,212,0.35)",
                color: "var(--primary)",
              }}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              className="flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                width: "48px",
                height: "48px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <List size={18} />
            </button>
          </div>

          {/* DIVIDER */}
          <div
            className="hidden sm:block"
            style={{
              width: "1px",
              height: "28px",
              background: "rgba(255,255,255,0.08)",
            }}
          />

          {/* SORT */}
          <button
            className="flex items-center gap-2 transition-colors duration-200 cursor-pointer"
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "var(--text-secondary)";
            }}
          >
            <SortDesc size={15} />
            Sort by: Updated
          </button>
        </div>
      </div>

      {/* NOTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => {
          const isHighlighted = index === 1;

          return (
            <Link
              href={`/notes/${note.id}`}
              key={note.id}
              className="group relative overflow-hidden flex flex-col justify-between"
              style={{
                minHeight: "280px",
                borderRadius: "20px",
                padding: "0",
                background: "#111318",
                border: isHighlighted
                  ? "1px solid rgba(0,245,212,0.45)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isHighlighted
                  ? "0 0 0 1px rgba(0,245,212,0.1), 0 8px 32px rgba(0,245,212,0.08)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                animation: `popIn 0.45s ease-out ${0.05 + index * 0.04}s forwards`,
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow = isHighlighted
                  ? "0 0 0 1px rgba(0,245,212,0.5), 0 20px 48px rgba(0,245,212,0.12)"
                  : "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = isHighlighted
                  ? "rgba(0,245,212,0.7)"
                  : "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = isHighlighted
                  ? "0 0 0 1px rgba(0,245,212,0.1), 0 8px 32px rgba(0,245,212,0.08)"
                  : "0 2px 8px rgba(0,0,0,0.3)";
                e.currentTarget.style.borderColor = isHighlighted
                  ? "rgba(0,245,212,0.45)"
                  : "rgba(255,255,255,0.06)";
              }}
            >
              {/* Accent top bar */}
              <div style={{
                height: "3px",
                width: "100%",
                background: isHighlighted
                  ? "linear-gradient(90deg, #00F5D4, rgba(0,245,212,0.2))"
                  : "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)",
                borderRadius: "20px 20px 0 0",
              }} />

              {/* Inner subtle glow for highlighted */}
              {isHighlighted && (
                <div style={{
                  position: "absolute",
                  top: 0, right: 0,
                  width: "200px", height: "200px",
                  background: "radial-gradient(circle, rgba(0,245,212,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
              )}

              {/* CARD CONTENT */}
              <div style={{ padding: "1.5rem 1.6rem 0", flex: 1, display: "flex", flexDirection: "column" }}>

                {/* TITLE ROW */}
                <div className="flex justify-between items-start mb-4">
                  <h4
                    className="line-clamp-2 pr-4 break-words group-hover:text-white transition-colors"
                    style={{
                      fontSize: "1.35rem",
                      lineHeight: "1.25",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {note.title || "Untitled Note"}
                  </h4>
                  <button
                    className="shrink-0 transition-all duration-200 mt-0.5 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      width: "30px",
                      height: "30px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* CONTENT PREVIEW */}
                <p
                  className="line-clamp-3 break-words flex-1"
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: "1.7",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {note.summary || note.content || "No content yet — click to start writing."}
                </p>
              </div>

              {/* FOOTER */}
              <div
                style={{
                  padding: "1rem 1.6rem 1.4rem",
                  marginTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {/* TAGS */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minWidth: 0, flex: 1 }}>
                  {(note.tags
                    ? note.tags.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 2)
                    : ["draft"]
                  ).map((t: string, i: number) => {
                    const isCyan = isHighlighted && i === 0;
                    const isYellow = t.toLowerCase().includes("design") || t.toLowerCase().includes("q3") || t.toLowerCase().includes("dev");
                    return (
                      <span
                        key={i}
                        style={{
                          padding: "3px 10px",
                          borderRadius: "8px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          maxWidth: "130px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontFamily: "var(--font-mono)",
                          border: isCyan
                            ? "1px solid rgba(0,245,212,0.3)"
                            : isYellow
                              ? "1px solid rgba(255,184,0,0.3)"
                              : "1px solid rgba(255,255,255,0.08)",
                          color: isCyan
                            ? "#00F5D4"
                            : isYellow
                              ? "#FFB800"
                              : "rgba(255,255,255,0.35)",
                          background: isCyan
                            ? "rgba(0,245,212,0.06)"
                            : isYellow
                              ? "rgba(255,184,0,0.04)"
                              : "rgba(255,255,255,0.02)",
                        }}
                      >
                        #{t.toLowerCase()}
                      </span>
                    );
                  })}
                </div>

                {/* DATE */}
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.72rem",
                    color: isHighlighted ? "var(--primary)" : "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: isHighlighted ? 700 : 500,
                  }}
                >
                  {isHighlighted && <PenLine size={11} />}
                  {isHighlighted ? "Just now" : getRelativeTime(new Date(note.updatedAt))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}