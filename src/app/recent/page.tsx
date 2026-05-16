"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, FileText, Sparkles, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function RecentNotes() {
  const { status } = useSession();
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
        // Filter out archived notes, and only show notes updated in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recent = data.filter((n: any) => !n.isArchived && new Date(n.updatedAt) >= sevenDaysAgo);
        setNotes(recent);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-12 overflow-x-hidden" style={{ maxWidth: '1000px', padding: '0 2rem', animation: 'fadeIn 0.5s ease-out forwards' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
      
      {/* Header section */}
      <div className="flex justify-between items-end mb-10 pb-6" style={{ borderBottom: '1px solid var(--border)', animation: 'slideUp 0.6s ease-out forwards' }}>
        <div>
          <h1 className="mb-2 font-heading font-bold tracking-tight flex items-center gap-4" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            <div className="rounded-xl flex items-center justify-center" style={{ width: '48px', height: '48px', background: 'var(--surface-light)', border: '1px solid var(--border)' }}>
              <Clock size={24} style={{ color: 'var(--primary)' }} />
            </div>
            Recent Notes
          </h1>
          <p className="text-secondary" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Notes you've edited in the last 7 days.</p>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center text-center mt-10" style={{ padding: '4rem 2rem', animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}>
          <div className="rounded-full flex items-center justify-center mb-6" style={{ width: '80px', height: '80px', background: 'var(--surface-light)', border: '1px solid var(--border)' }}>
            <Clock size={32} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{searchQuery ? "No matching notes" : "No recent activity"}</h3>
          <p className="mb-8 max-w-sm mx-auto" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {searchQuery ? "Try searching for something else." : "You haven't edited any notes in the past week."}
          </p>
          <button 
            onClick={createNote} 
            className="flex items-center gap-2 font-bold cursor-pointer transition-all duration-200" 
            style={{ background: 'var(--surface-light)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '0.75rem 2rem', borderRadius: '9999px', fontSize: '1rem' }} 
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(0,245,212,0.05)'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-light)'; }}
          >
            Create New Note <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden flex flex-col" style={{ padding: '0', animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}>
          {filteredNotes.map((note, index) => (
            <Link 
              href={`/notes/${note.id}`} 
              key={note.id} 
              className="group block relative transition-colors duration-300 cursor-pointer"
              style={{ borderBottom: index !== notes.length - 1 ? '1px solid var(--border)' : 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-6 flex items-start gap-5">
                <div className="rounded-lg flex items-center justify-center transition-colors group-hover:border-primary group-hover:bg-primary/10 flex-shrink-0 mt-1" style={{ width: '44px', height: '44px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <FileText size={20} className="text-secondary group-hover:text-primary transition-colors" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-heading font-bold text-primary-hover group-hover:text-primary transition-colors truncate pr-4" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                      {note.title || 'Untitled Note'}
                    </h4>
                    <span className="text-muted whitespace-nowrap pt-1 font-mono flex items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
                      <Clock size={12} />
                      {format(new Date(note.updatedAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  
                  <p className="line-clamp-2 leading-relaxed mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {note.summary || note.content || 'Empty note'}
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                    {note.tags && note.tags.split(',').map((t: string) => t.trim()).filter(Boolean).map((t: string, i: number) => (
                      <span 
                        key={i} 
                        className="rounded border uppercase tracking-wider font-bold" 
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.65rem', 
                          background: 'var(--surface)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {note.summary && !note.tags && (
                      <span 
                        className="rounded border uppercase tracking-wider font-bold flex items-center gap-1" 
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.65rem', 
                          background: 'rgba(255, 184, 0, 0.1)', 
                          borderColor: 'rgba(255, 184, 0, 0.2)', 
                          color: 'var(--accent)' 
                        }}
                      >
                        <Sparkles size={10} /> AI Summary
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
