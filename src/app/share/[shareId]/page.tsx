"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SharedNote({ params }: { params: Promise<{ shareId: string }> }) {
  const unwrappedParams = React.use(params);
  const shareId = unwrappedParams.shareId;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const res = await fetch(`/api/shared/${shareId}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data);
        } else {
          setError("Note not found or has been removed.");
        }
      } catch (err) {
        setError("Error loading note.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col justify-center items-center text-center animate-fade-in h-screen bg-background p-4">
        <div className="glass-panel p-12 max-w-lg w-full">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-surface-light border border-border">
            <BookOpen size={24} className="text-muted" />
          </div>
          <h2 className="mb-4 text-2xl">Note Unavailable</h2>
          <p className="text-secondary mb-8 text-sm">The link might be broken or the owner has stopped sharing this note.</p>
          <Link href="/" className="btn btn-primary rounded-full px-8 py-2">Return Home</Link>
        </div>
      </div>
    );
  }

  const actionItems = note.actionItems ? JSON.parse(note.actionItems) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1000px] mx-auto p-4 sm:p-8 animate-fade-in pb-20">
        
        {/* Viewer Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-light border border-border">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-[#00A690] rounded-sm opacity-80" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
            </div>
            <div>
              <div className="text-primary font-heading font-bold text-lg tracking-tight leading-none">Peblo</div>
              <div className="text-secondary text-[0.65rem] leading-tight mt-1 uppercase tracking-widest font-semibold">Shared Note</div>
            </div>
          </Link>
          <div className="bg-surface-light border border-border px-4 py-1.5 rounded-full text-xs flex items-center gap-2">
            <span className="text-muted">Shared by</span>
            <span className="font-semibold text-primary">{note.user?.name || "Anonymous"}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-panel mb-8 relative overflow-hidden bg-surface">
          <div className="px-8 py-10 md:px-12 md:py-16">
            <h1 className="mb-6 text-4xl font-heading font-bold text-primary">{note.title || 'Untitled Note'}</h1>
            
            {note.tags && (
              <div className="flex gap-2 mb-10 flex-wrap">
                {note.tags.split(',').map((t: string) => t.trim()).filter(Boolean).map((t: string, i: number) => (
                  <span key={i} className="tag">{t}</span>
                ))}
              </div>
            )}
            
            <div className="text-lg leading-relaxed text-text-primary whitespace-pre-wrap font-sans opacity-90">
              {note.content}
            </div>
          </div>
        </div>

        {/* AI Insights (If present) */}
        {note.summary && (
          <div className="glass-panel relative overflow-hidden bg-surface-light border-t-2 border-t-accent p-8 md:p-10 mb-12">
            
            <h3 className="flex items-center gap-2 text-accent mb-6 text-lg uppercase tracking-widest font-bold">
              <Sparkles size={20} />
              AI Insights
            </h3>
            
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <h4 className="text-[10px] text-secondary mb-3 uppercase tracking-widest font-bold">Summary</h4>
                <p className="text-base leading-relaxed">{note.summary}</p>
              </div>

              {actionItems.length > 0 && (
                <div className="flex-1 md:border-l border-border md:pl-10">
                  <h4 className="text-[10px] text-secondary mb-3 uppercase tracking-widest font-bold">Action Items</h4>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {actionItems.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start text-sm">
                        <div className="mt-0.5"><CheckCircle2 size={14} className="text-primary" /></div>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="text-center mt-16 mb-8 glass-panel p-10 max-w-2xl mx-auto border-primary border">
          <h3 className="mb-3 text-2xl font-heading font-bold text-primary">Want to create your own?</h3>
          <p className="text-secondary mb-8 text-sm">Join Peblo to start creating AI-powered notes and sharing them with the world.</p>
          <Link href="/signup" className="btn btn-primary rounded-full px-8 py-3 text-sm group font-semibold shadow-[0_0_15px_rgba(0,245,212,0.4)]">
            Join Peblo for Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
