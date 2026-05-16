"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, Share2, Sparkles, Trash2, CheckCircle2, Archive, ListTodo, FileText, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function NoteEditor({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchNote();
    }
  }, [status, id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      if (res.ok) {
        const found = await res.json();
        setNote(found);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const saveNote = async (updates: any) => {
    setSaving(true);
    try {
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      setNote((prev: any) => ({ ...prev, ...updates }));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const handleChange = (field: string, value: string) => {
    setNote((prev: any) => ({ ...prev, [field]: value }));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote({ [field]: value });
    }, 1200);
  };

  const generateAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/notes/${id}/generate-summary`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setNote(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    let currentShareId = note.shareId;
    if (!currentShareId) {
      currentShareId = Math.random().toString(36).substring(2, 15);
      await saveNote({ shareId: currentShareId });
      setNote((prev: any) => ({ ...prev, shareId: currentShareId }));
    }

    const url = `${window.location.origin}/share/${currentShareId}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const deleteNote = async () => {
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      router.push("/dashboard");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/notes/${id}/chat`, {
        method: "POST",
        body: JSON.stringify({ message: userMsg })
      });
      
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting to the neural engine. Please try again later." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'ai', content: "Connection error. Please check your network." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-screen gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
        <p className="text-secondary font-mono text-xs uppercase tracking-widest animate-pulse">Loading Workspace...</p>
      </div>
    );
  }

  if (!note) return null;

  const actionItems = note.actionItems ? JSON.parse(note.actionItems) : [];

  return (
    <div className="h-screen w-full overflow-hidden p-6" style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .editor-container { background: linear-gradient(180deg, rgba(18, 20, 28, 0.4) 0%, rgba(18, 20, 28, 0) 100%); }
      `}} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full mx-auto">

        {/* EDITOR SECTION (Left Pane) - Adjusted to flex-1 for 50/50 split */}
        <div
          className="editor-container flex-col relative flex-1 flex overflow-hidden rounded-3xl"
          style={{
            animation: 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            background: '#0E1016',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top Toolbar */}
          <div className="flex-none flex justify-between items-center px-6 py-4 border-b backdrop-blur-xl" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(14,16,22,0.95)' }}>
            <div className="flex items-center gap-5">
              <Link href="/notes" className="flex items-center gap-2 transition-all duration-300 group" style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-[0.6rem]">Back</span>
              </Link>

              <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />

              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 12px', borderRadius: '99px',
                background: saving ? 'rgba(255,184,0,0.08)' : 'rgba(0,245,212,0.08)',
                border: saving ? '1px solid rgba(255,184,0,0.2)' : '1px solid rgba(0,245,212,0.2)',
              }}>
                {saving ? (
                  <><Save size={12} style={{ color: 'var(--accent)', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>Syncing</span></>
                ) : (
                  <><CheckCircle2 size={12} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)' }}>Cloud Synced</span></>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '12px',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: shareCopied ? 'rgba(0,245,212,0.1)' : 'transparent',
                  border: shareCopied ? '1px solid rgba(0,245,212,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  color: shareCopied ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {shareCopied ? <CheckCircle2 size={14} /> : <Share2 size={14} />}
                {shareCopied ? 'Copied!' : 'Share'}
              </button>

              <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />

              <button
                onClick={() => { saveNote({ isArchived: true }).then(() => router.push('/notes')); }}
                title="Archive"
                style={{ padding: '8px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <Archive size={16} />
              </button>
              <button
                onClick={deleteNote}
                title="Delete"
                style={{ padding: '8px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; e.currentTarget.style.color = '#EF4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Main Writing Area */}
          <div className="editor-reset flex-1 overflow-y-auto hide-scrollbar flex flex-col items-center">

            {/* Inner Content Container */}
            <div
              className="w-full max-w-3xl flex flex-col px-10 py-10 lg:px-12 lg:py-14"
              style={{
                transform: "translateZ(0)",
              }}
            >

              {/* Title Input */}
              <input
                type="text"
                value={note.title || ""}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                placeholder="Give it a name..."
                className="w-full font-heading font-black text-left"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  padding: 0,
                  margin: 0,
                  marginBottom: "1.5rem",
                  color: "var(--text-primary)",
                  fontSize: "clamp(3.6rem, 5vw, 4.5rem)",
                  lineHeight: "0.95",
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  width: "100%",
                }}
              />

              {/* Tags */}
              <div
                className="flex items-center gap-4 mb-10"
                style={{
                  paddingBottom: "1.5rem",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <FileText
                  size={18}
                  className="text-muted shrink-0"
                />

                <input
                  type="text"
                  value={note.tags || ""}
                  onChange={(e) =>
                    handleChange("tags", e.target.value)
                  }
                  placeholder="Add tags (comma separated)..."
                  className="flex-1"
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    padding: 0,
                    margin: 0,
                    color: "rgba(255,255,255,0.58)",
                    fontSize: "0.98rem",
                    fontWeight: 500,
                    width: "100%",
                  }}
                />
              </div>

              {/* Content Textarea */}
              <textarea
                value={note.content || ""}
                onChange={(e) =>
                  handleChange("content", e.target.value)
                }
                spellCheck={false}
                placeholder="What's on your mind? The blank page is your canvas..."
                className="hide-scrollbar w-full resize-none"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  padding: 0,
                  margin: 0,
                  minHeight: "55vh",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "1.08rem",
                  lineHeight: "2",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  overflow: "hidden",
                  textAlign: "left",
                  textRendering: "optimizeLegibility",
                  WebkitFontSmoothing:
                    "antialiased",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>


        {/* AI ASSISTANT SECTION (Right Pane) - Adjusted to flex-1 for 50/50 split */}
        <div
          className="flex-col relative overflow-hidden flex-1 hidden lg:flex rounded-3xl"
          style={{
            animation: 'slideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
            opacity: 0,
            background: '#0A0C12',
            border: '1px solid rgba(0,245,212,0.12)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,245,212,0.05)',
          }}
        >
          {/* Background glow */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,245,212,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(0,245,212,0.1)', background: 'rgba(0,245,212,0.02)', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: generating ? 'rgba(0,245,212,0.15)' : 'rgba(0,245,212,0.08)',
                border: '1px solid rgba(0,245,212,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: generating ? '0 0 16px rgba(0,245,212,0.3)' : 'none',
                transition: 'all 0.3s',
              }}>
                <Sparkles size={16} style={{ color: 'var(--primary)', animation: generating ? 'spin 1s linear infinite' : 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)' }}>Neural Assistant</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>AI-Powered Cognition</div>
              </div>
            </div>
            <button
              onClick={generateAI}
              disabled={generating || !note.content}
              style={{
                padding: '8px 18px', borderRadius: '10px',
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                background: generating ? 'rgba(0,245,212,0.06)' : 'var(--primary)',
                border: '1px solid var(--primary)',
                color: generating ? 'var(--primary)' : '#000',
                cursor: (!note.content && !generating) ? 'not-allowed' : 'pointer',
                opacity: (!note.content && !generating) ? 0.3 : 1,
                transition: 'all 0.3s',
                boxShadow: generating ? 'none' : '0 4px 16px rgba(0,245,212,0.25)',
              }}
            >
              {generating ? 'Analyzing...' : 'Generate'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar z-10 relative flex flex-col p-10" ref={scrollRef}>
            {note.summary || chatMessages.length > 0 ? (
              <div className="flex flex-col gap-12" style={{ animation: 'fadeIn 0.8s ease-out' }}>

                {note.summary && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '3px', height: '16px', borderRadius: '99px', background: 'var(--primary)' }} />
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Synthesis</span>
                    </div>
                    <div style={{ borderRadius: '16px', padding: '22px 24px', background: 'rgba(0,245,212,0.04)', border: '1px solid rgba(0,245,212,0.12)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, rgba(0,245,212,0.5), transparent)' }} />
                      <p style={{ fontSize: '0.875rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>"{note.summary}"</p>
                    </div>
                  </div>
                )}

                {actionItems.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '3px', height: '16px', borderRadius: '99px', background: 'var(--accent)' }} />
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Action Roadmap</span>
                    </div>
                    <div style={{ borderRadius: '16px', padding: '22px 24px', background: 'rgba(255,184,0,0.04)', border: '1px solid rgba(255,184,0,0.12)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, rgba(255,184,0,0.5), transparent)' }} />
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {actionItems.map((item: string, i: number) => (
                          <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ marginTop: '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.25)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <CheckCircle2 size={11} />
                            </div>
                            <span style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Chat History */}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`relative group/chat ${msg.role === 'user' ? 'self-end' : ''}`}>
                    <h4 className={`flex items-center gap-2 uppercase tracking-widest font-bold mb-4 text-[0.65rem] text-[var(--text-secondary)] ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'ai' ? (
                        <><Sparkles size={14} className="text-primary" /> Assistant</>
                      ) : (
                        <><User size={14} className="text-white" /> You</>
                      )}
                    </h4>
                    <div className={`rounded-2xl p-6 border ${msg.role === 'ai' ? 'bg-[rgba(30,33,43,0.4)] border-[var(--border)]' : 'bg-primary/5 border-primary/20'} shadow-sm max-w-[90%]`}>
                      <p className="text-[0.9rem] leading-[1.7] text-[var(--text-primary)]">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-3 text-[var(--text-muted)] italic text-[0.8rem] animate-pulse px-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-150"></div>
                    </div>
                    Neural engine thinking...
                  </div>
                )}

                <div className="mt-auto pt-10 pb-20 flex items-center justify-center gap-2 opacity-30">
                  <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
                  <div className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-widest uppercase">
                    Session Encrypted • {format(new Date(), 'h:mm a')}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full pb-10">
                <div className="relative mb-10">
                  <div className="absolute inset-0 bg-[var(--primary)]/20 blur-3xl rounded-full"></div>
                  <div className="relative rounded-3xl flex items-center justify-center border border-[var(--primary)]/20 shadow-2xl w-24 h-24 bg-[rgba(30,33,43,0.6)]">
                    <Sparkles size={40} className="text-[var(--primary)] animate-pulse" />
                  </div>
                </div>
                <h3 className="font-heading font-black mb-4 text-2xl text-[var(--text-primary)]">Cognitive Engine</h3>
                <p className="max-w-[280px] mx-auto text-[var(--text-secondary)] text-[0.95rem] leading-[1.8]">
                  Feed the engine with your thoughts. I'll extract the core essence and assist you.
                </p>

                <div className="mt-12 flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/30 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/30 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/30 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* AI Chat Input */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px 20px 20px', background: 'linear-gradient(to top, #0A0C12 60%, transparent)', zIndex: 20 }}>
            <form onSubmit={handleSendMessage} style={{ position: 'relative' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask the Neural Assistant..."
                style={{
                  width: '100%', background: 'rgba(20,23,32,0.95)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,245,212,0.15)', borderRadius: '14px',
                  padding: '14px 52px 14px 18px',
                  fontSize: '0.875rem', color: '#fff', outline: 'none', transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,245,212,0.08)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  width: '34px', height: '34px', borderRadius: '10px', border: 'none',
                  background: chatInput.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                  color: chatInput.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                  cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}