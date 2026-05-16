"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Share2, Globe, ExternalLink, Copy, CheckCircle2, Search } from "lucide-react";
import { format } from "date-fns";

export default function SharedNotes() {
  const { status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        const shared = data.filter((n: any) => !n.isArchived && n.shareId);
        setNotes(shared);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (e: React.MouseEvent, shareId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-12 overflow-x-hidden" style={{ maxWidth: '1400px', padding: '0 2rem', animation: 'fadeIn 0.5s ease-out forwards' }}>
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
              <Share2 size={24} style={{ color: 'var(--primary)' }} />
            </div>
            Shared Notes
          </h1>
          <p className="text-secondary" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Notes you've made publicly accessible via link.</p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center text-center mt-10" style={{ padding: '4rem 2rem', animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}>
          <div className="rounded-full flex items-center justify-center mb-6" style={{ width: '80px', height: '80px', background: 'var(--surface-light)', border: '1px solid var(--border)' }}>
            <Globe size={32} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>No shared notes</h3>
          <p className="mb-8 max-w-sm mx-auto" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            You haven't shared any notes yet. Open a note and click the Share button to create a public link.
          </p>
          <Link 
            href="/notes" 
            className="flex items-center gap-2 font-bold cursor-pointer transition-all duration-200" 
            style={{ background: 'var(--surface-light)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '0.75rem 2rem', borderRadius: '9999px', fontSize: '1rem' }} 
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(0,245,212,0.05)'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-light)'; }}
          >
            <Search size={18} /> Browse All Notes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note, index) => (
            <Link 
              href={`/notes/${note.id}`} 
              key={note.id} 
              className="glass-panel group relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
              style={{ 
                height: '240px', 
                padding: '1.5rem', 
                animation: `popIn 0.5s ease-out ${0.1 + (index * 0.05)}s forwards`, 
                opacity: 0,
                border: '1px solid var(--border)'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-4px)'; 
                e.currentTarget.style.borderColor = 'var(--primary)'; 
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.borderColor = 'var(--border)'; 
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#00A690] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 rounded-full transition-transform duration-700 group-hover:scale-150" style={{ width: '150px', height: '150px', background: 'rgba(0, 245, 212, 0.03)', filter: 'blur(30px)', marginRight: '-50px', marginTop: '-50px', pointerEvents: 'none' }}></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="rounded-lg flex items-center justify-center transition-colors group-hover:border-primary group-hover:bg-primary/10" style={{ width: '40px', height: '40px', background: 'var(--surface-light)', border: '1px solid var(--border)' }}>
                  <Globe size={18} className="text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
              
              <h4 className="font-heading font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors relative z-10" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {note.title || 'Untitled Note'}
              </h4>
              
              <p className="line-clamp-2 flex-1 relative z-10" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {note.summary ? note.summary : note.content ? note.content : 'Empty note'}
              </p>
              
              <div className="mt-auto pt-4 flex justify-between items-center relative z-10" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Shared {format(new Date(note.updatedAt), 'MMM d')}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => copyLink(e, note.shareId)}
                    className="flex items-center gap-1.5 transition-colors cursor-pointer font-bold uppercase tracking-wide"
                    style={{ 
                      background: copiedId === note.shareId ? 'rgba(0, 245, 212, 0.1)' : 'var(--surface-light)', 
                      border: '1px solid',
                      borderColor: copiedId === note.shareId ? 'rgba(0, 245, 212, 0.3)' : 'var(--border)', 
                      color: copiedId === note.shareId ? 'var(--primary)' : 'var(--text-primary)', 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.6rem'
                    }}
                    onMouseEnter={(e) => { if(copiedId !== note.shareId) { e.currentTarget.style.borderColor = 'var(--text-secondary)'; } }}
                    onMouseLeave={(e) => { if(copiedId !== note.shareId) { e.currentTarget.style.borderColor = 'var(--border)'; } }}
                  >
                    {copiedId === note.shareId ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copiedId === note.shareId ? "Copied" : "Copy Link"}
                  </button>
                  <a 
                    href={`/share/${note.shareId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center transition-colors cursor-pointer"
                    style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', color: 'var(--text-primary)', width: '32px', height: '32px', borderRadius: '0.375rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    title="Open public link"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
