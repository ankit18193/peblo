"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Sparkles, Edit3, MessageSquare, Search, MoreHorizontal, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { searchQuery } = useWorkspace();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredNotes = notes.filter(note => {
    return (note.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
           (note.content || "").toLowerCase().includes(searchQuery.toLowerCase());
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

  const createNote = async () => {
    const res = await fetch("/api/notes", { method: "POST", body: JSON.stringify({}) });
    if (res.ok) {
      const note = await res.json();
      router.push(`/notes/${note.id}`);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalNotes = notes.length;
  const aiGeneratedCount = notes.filter(n => n.summary).length;
  
  // Weekly data calculations from real notes
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  let maxCount = 0;
  
  notes.forEach(note => {
    if (!note.updatedAt) return;
    const date = new Date(note.updatedAt);
    const day = date.getDay();
    const index = day === 0 ? 6 : day - 1; // 0=Mon, 6=Sun
    dayCounts[index]++;
    if (dayCounts[index] > maxCount) maxCount = dayCounts[index];
  });

  const chartHeights = dayCounts.map(count => {
    if (maxCount === 0) return 5; // Default tiny bar if no data at all
    if (count === 0) return 5;
    return Math.max(15, Math.round((count / maxCount) * 85)); // Max 85% to leave room at top
  });
  
  const activeDay = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0-6 starting Monday

  return (
    <div className="mx-auto pb-12" style={{ maxWidth: '1200px', padding: '0 2rem', animation: 'fadeIn 0.5s ease-out forwards' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6" style={{ borderBottom: '1px solid var(--border)', animation: 'slideUp 0.6s ease-out forwards' }}>
        <div>
          <h1 className="mb-2 font-heading font-bold tracking-tight" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            Good evening, <span style={{ color: 'var(--primary)' }}>{session?.user?.name?.split(' ')[0] || 'Explorer'}</span>.
          </h1>
          <p className="text-secondary" style={{ fontSize: '1rem' }}>Here is a summary of your workspace activity.</p>
        </div>
        <div 
          className="flex items-center gap-2 rounded-full font-semibold uppercase"
          style={{ 
            padding: '0.5rem 1rem',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            background: 'rgba(0, 245, 212, 0.1)', 
            color: 'var(--primary)', 
            border: '1px solid rgba(0, 245, 212, 0.3)', 
            boxShadow: '0 0 15px rgba(0, 245, 212, 0.1)',
            marginTop: '1rem'
          }}
        >
          <Sparkles size={14} className="animate-pulse" /> Workspace Sync Active
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Notes */}
        <div className="glass-panel relative overflow-hidden group" style={{ padding: '1.5rem', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'popIn 0.6s ease-out 0.1s forwards', opacity: 0 }}>
          <div className="absolute top-0 right-0 rounded-full transition-transform group-hover:scale-150" style={{ width: '150px', height: '150px', background: 'rgba(0, 245, 212, 0.05)', filter: 'blur(30px)', marginRight: '-30px', marginTop: '-30px' }}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <span className="font-bold uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Total Notes</span>
            <div className="rounded-lg flex items-center justify-center transition-colors" style={{ width: '40px', height: '40px', background: 'var(--surface-light)', border: '1px solid var(--border)' }}>
              <FileText color="var(--primary)" size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="font-heading font-bold mb-2" style={{ fontSize: '4rem', lineHeight: 1, color: 'var(--text-primary)' }}>{totalNotes}</div>
            <div className="flex items-center gap-1 font-medium" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span className="font-bold flex items-center" style={{ color: 'var(--primary)' }}><ArrowRight size={14} className="-rotate-45" /> 12%</span> vs last week
            </div>
          </div>
        </div>

        {/* AI Summaries */}
        <div className="glass-panel relative overflow-hidden group" style={{ padding: '1.5rem', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255, 184, 0, 0.2)', animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}>
          <div className="absolute top-0 right-0 w-full h-full" style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255, 184, 0, 0.08) 100%)' }}></div>
          <div className="absolute top-0 right-0 rounded-full transition-transform group-hover:scale-150" style={{ width: '150px', height: '150px', background: 'rgba(255, 184, 0, 0.05)', filter: 'blur(30px)', marginRight: '-30px', marginTop: '-30px' }}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <span className="font-bold uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>AI Insights</span>
            <div className="rounded-lg flex items-center justify-center" style={{ width: '40px', height: '40px', background: 'var(--surface-light)', border: '1px solid rgba(255, 184, 0, 0.3)' }}>
              <Sparkles color="var(--accent)" size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="font-heading font-bold mb-2" style={{ fontSize: '4rem', lineHeight: 1, color: 'var(--text-primary)' }}>{aiGeneratedCount}</div>
            <div className="font-medium" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Generated successfully
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel relative overflow-hidden" style={{ padding: '1.5rem', height: '200px', display: 'flex', flexDirection: 'column', animation: 'popIn 0.6s ease-out 0.3s forwards', opacity: 0 }}>
          <span className="font-bold uppercase mb-4 block" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Quick Actions</span>
          
          <div className="flex gap-4 flex-1">
            <button 
              onClick={createNote} 
              className="flex-1 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div className="rounded-full flex items-center justify-center transition-transform" style={{ width: '40px', height: '40px', background: 'rgba(0, 245, 212, 0.1)' }}>
                <Edit3 color="var(--primary)" size={18} />
              </div>
              <span className="font-medium" style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>New Note</span>
            </button>
            
            <Link 
              href="/notes" 
              className="flex-1 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors" 
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div className="rounded-full flex items-center justify-center transition-transform" style={{ width: '40px', height: '40px', background: 'rgba(255, 184, 0, 0.1)' }}>
                <Search color="var(--accent)" size={18} />
              </div>
              <span className="font-medium" style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>Browse All</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Activity Chart — spans 2 cols, smooth area/line */}
        <div className="glass-panel relative overflow-hidden flex flex-col lg:col-span-2" style={{ padding: '1.5rem', minHeight: '400px', animation: 'slideUp 0.6s ease-out 0.4s forwards', opacity: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-heading font-bold" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Learning Activity</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Notes edited per day this week</p>
            </div>
            <span className="font-medium flex items-center gap-1 cursor-pointer rounded-full border" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', color: 'var(--primary)', background: 'rgba(0, 245, 212, 0.1)', borderColor: 'rgba(0, 245, 212, 0.2)' }}>This Week ▾</span>
          </div>

          <AreaChart dayCounts={dayCounts} weekDays={weekDays} activeDay={activeDay} />
        </div>

        {/* Recently Edited */}
        <div className="glass-panel flex flex-col" style={{ minHeight: '400px', animation: 'slideUp 0.6s ease-out 0.5s forwards', opacity: 0 }}>
          <div className="flex justify-between items-center border-b" style={{ padding: '1.5rem', borderColor: 'var(--border)' }}>
            <h3 className="font-heading font-bold" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Recent Notes</h3>
            <Link href="/notes" className="transition-colors" style={{ color: 'var(--text-muted)' }}>
              <MoreHorizontal size={20} />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto" style={{ padding: '0.5rem' }}>
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>
                <div className="rounded-full border flex items-center justify-center mb-3" style={{ width: '48px', height: '48px', background: 'var(--surface-light)', borderColor: 'var(--border)' }}>
                  <Clock size={20} color="var(--text-muted)" />
                </div>
                <p style={{ fontSize: '0.875rem' }}>{searchQuery ? "No matching notes found." : "No notes edited recently."}</p>
              </div>
            ) : (
              filteredNotes.slice(0, 4).map((note, index) => (
                <Link 
                  href={`/notes/${note.id}`} 
                  key={note.id} 
                  className="block border border-transparent group transition-colors" 
                  style={{ 
                    padding: '1rem', 
                    margin: '0.25rem 0.5rem', 
                    borderRadius: '0.75rem', 
                    animation: `popIn 0.4s ease-out ${0.6 + (index * 0.1)}s forwards`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  <div className="flex gap-4 items-start">
                    <div className="rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors" style={{ width: '40px', height: '40px', background: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <FileText size={16} color="var(--text-muted)" className="group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <h4 className="font-semibold transition-colors truncate mb-1 group-hover:text-primary" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {note.title || 'Untitled Note'}
                      </h4>
                      <p className="line-clamp-1 mb-2 leading-relaxed" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {note.summary || note.content || 'Empty note'}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex gap-2">
                          {note.tags && note.tags.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 1).map((t: string, i: number) => (
                            <span key={i} className="rounded border uppercase tracking-wider font-bold" style={{ padding: '0.125rem 0.5rem', fontSize: '0.5625rem', background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }}>{t}</span>
                          ))}
                        </div>
                        <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{format(new Date(note.updatedAt), 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="border-t" style={{ padding: '1rem', borderColor: 'var(--border)', marginTop: 'auto' }}>
            <Link 
              href="/notes" 
              className="w-full border rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors" 
              style={{ padding: '0.5rem 0', fontSize: '0.875rem', background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; }}
            >
              View All Notes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── AREA / LINE CHART COMPONENT ── */
function AreaChart({ dayCounts, weekDays, activeDay }: { dayCounts: number[], weekDays: string[], activeDay: number }) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const W = 600;
  const H = 220;
  const padL = 36;
  const padR = 20;
  const padT = 20;
  const padB = 36;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...dayCounts, 1);
  const n = dayCounts.length;

  // Map data → SVG coordinates
  const pts = dayCounts.map((v, i) => ({
    x: padL + (i / (n - 1)) * chartW,
    y: padT + chartH - (v / maxVal) * chartH,
    v,
  }));

  // Smooth cubic bezier path
  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`;
  }, '');

  // Closed area path (line + bottom edge)
  const areaPath = `${linePath} L ${pts[n - 1].x},${padT + chartH} L ${pts[0].x},${padT + chartH} Z`;

  // Y-axis guide line values
  const guides = [0, 0.33, 0.66, 1].map(r => ({
    y: padT + chartH - r * chartH,
    label: Math.round(r * maxVal),
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', flex: 1, overflow: 'visible' }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          {/* Gradient fill under the line */}
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.01" />
          </linearGradient>
          {/* Glow filter for the active dot */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines + Y labels */}
        {guides.map((g, i) => (
          <g key={i}>
            <line
              x1={padL} y1={g.y} x2={W - padR} y2={g.y}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              strokeDasharray={i === 0 ? '0' : '4 4'}
            />
            <text x={padL - 8} y={g.y + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace">
              {g.label}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* The line itself */}
        <path
          d={linePath}
          fill="none"
          stroke="#00F5D4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,245,212,0.4))' }}
        />

        {/* Dots + hover areas */}
        {pts.map((p, i) => (
          <g key={i}>
            {/* Invisible wide hit area */}
            <rect
              x={p.x - chartW / (2 * n)}
              y={padT}
              width={chartW / n}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
            />

            {/* Outer ring (always visible for active day) */}
            {(i === activeDay || hoveredIdx === i) && (
              <circle cx={p.x} cy={p.y} r="10" fill="rgba(0,245,212,0.12)" />
            )}

            {/* Dot */}
            <circle
              cx={p.x} cy={p.y} r="4.5"
              fill={i === activeDay ? '#00F5D4' : hoveredIdx === i ? '#00F5D4' : '#1A1C23'}
              stroke="#00F5D4"
              strokeWidth="2"
              style={{ filter: (i === activeDay || hoveredIdx === i) ? 'url(#glow)' : 'none', transition: 'all 0.2s' }}
            />

            {/* X-axis day label */}
            <text
              x={p.x} y={H - 6}
              textAnchor="middle"
              fill={i === activeDay ? '#00F5D4' : 'rgba(255,255,255,0.3)'}
              fontSize="10"
              fontWeight={i === activeDay ? '700' : '500'}
              fontFamily="monospace"
            >
              {weekDays[i]}
            </text>

            {/* Tooltip bubble */}
            {hoveredIdx === i && (
              <g>
                <rect
                  x={p.x - 28} y={p.y - 32}
                  width="56" height="22"
                  rx="6"
                  fill="#2D313E"
                  stroke="rgba(0,245,212,0.3)"
                  strokeWidth="1"
                />
                <text
                  x={p.x} y={p.y - 17}
                  textAnchor="middle"
                  fill="#00F5D4"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {p.v} note{p.v !== 1 ? 's' : ''}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
