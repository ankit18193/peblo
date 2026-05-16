"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Archive, FileText, ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function ArchivedNotes() {
  const { status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Only show archived notes
        const archived = data.filter((n: any) => n.isArchived);
        setNotes(archived);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveNote = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: false }),
      });
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this note?")) {
      try {
        await fetch(`/api/notes/${id}`, { method: "DELETE" });
        setNotes(notes.filter(n => n.id !== id));
      } catch (err) {
        console.error(err);
      }
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
              <Archive size={24} style={{ color: 'var(--text-secondary)' }} />
            </div>
            Archive
          </h1>
          <p className="text-secondary" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Notes you've archived are stored here.</p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center text-center mt-10" style={{ padding: '4rem 2rem', animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}>
          <div className="rounded-full flex items-center justify-center mb-6" style={{ width: '80px', height: '80px', background: 'var(--surface-light)', border: '1px solid var(--border)' }}>
            <Archive size={32} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Your archive is empty</h3>
          <p className="mb-8 max-w-sm mx-auto" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Archived notes will appear here. You can archive notes to remove them from your main workspace without deleting them.
          </p>
          <Link 
            href="/notes" 
            className="flex items-center gap-2 font-bold cursor-pointer transition-all duration-200" 
            style={{ background: 'var(--surface-light)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '0.75rem 2rem', borderRadius: '9999px', fontSize: '1rem' }} 
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(0,245,212,0.05)'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-light)'; }}
          >
            <ArrowLeft size={18} /> Back to Notes
          </Link>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden flex flex-col" style={{ padding: '0', animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}>
          {notes.map((note, index) => (
            <div 
              key={note.id} 
              className="group block relative transition-colors duration-300"
              style={{ borderBottom: index !== notes.length - 1 ? '1px solid var(--border)' : 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-6 flex items-start gap-5">
                <div className="rounded-lg flex items-center justify-center transition-colors opacity-50 flex-shrink-0 mt-1" style={{ width: '44px', height: '44px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <FileText size={20} className="text-secondary" />
                </div>
                
                <div className="flex-1 min-w-0 opacity-60 transition-opacity group-hover:opacity-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-heading font-bold text-text-secondary group-hover:text-primary transition-colors truncate pr-4" style={{ fontSize: '1.25rem' }}>
                      {note.title || 'Untitled Note'}
                    </h4>
                    <span className="text-muted whitespace-nowrap pt-1 font-mono flex items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
                      Archived {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <p className="line-clamp-2 leading-relaxed mb-1" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {note.summary || note.content || 'Empty note'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => unarchiveNote(e, note.id)}
                    className="flex items-center justify-center transition-colors cursor-pointer"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '0.5rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    title="Unarchive"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button 
                    onClick={(e) => deleteNote(e, note.id)}
                    className="flex items-center justify-center transition-colors cursor-pointer"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: '#EF4444', width: '36px', height: '36px', borderRadius: '0.5rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
                    title="Permanently Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
