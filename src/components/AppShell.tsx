"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  BookOpen, LayoutDashboard, FileText, Clock, Share2,
  Archive, HelpCircle, Settings, Search, Plus, Bell
} from "lucide-react";
import Navbar from "./Navbar";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { searchQuery, setSearchQuery, activeFolder, setActiveFolder, activeTag, setActiveTag } = useWorkspace();

  const isAuthRoute = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/notes') || 
                      pathname.startsWith('/recent') || 
                      pathname.startsWith('/shared') || 
                      pathname.startsWith('/archive') || 
                      pathname.startsWith('/settings') || 
                      pathname.startsWith('/profile');
  const isAuthReady = status === "authenticated";
  const [isFolderSidebarOpen, setIsFolderSidebarOpen] = React.useState(true);

  if (!isAuthRoute || !isAuthReady) {
    return (
      <>
        <Navbar />
        <main className="container pb-8">
          {children}
        </main>
      </>
    );
  }

  const isNotesPage = pathname === '/notes';

  // Auth Layout with Sidebar and Topbar
  return (
    <div className="app-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Primary Sidebar */}
      <aside className="sidebar" style={{ width: '240px', minWidth: '240px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--background)' }}>
        <div className="px-6 mb-8 mt-6 flex items-center gap-3">
          <div className="flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div>
            <div className="text-primary font-heading font-bold text-lg tracking-tight leading-none">Peblo Notes</div>
            <div className="text-muted text-[0.55rem] tracking-[0.1em] font-bold uppercase mt-1">Collaborative AI Workspace</div>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === '/dashboard'} />

          <div className="my-2"></div>

          <SidebarItem href="/notes" icon={<FileText size={18} />} label="All Notes" active={pathname === '/notes'} />
          <SidebarItem href="/recent" icon={<Clock size={18} />} label="Recent" active={pathname === '/recent'} />
          <SidebarItem href="/shared" icon={<Share2 size={18} />} label="Shared" active={pathname === '/shared'} />
          <SidebarItem href="/archive" icon={<Archive size={18} />} label="Archive" active={pathname === '/archive'} />
        </nav>

        <div className="px-4 mt-auto mb-6">
          <div className="w-full h-[1px] bg-border mb-6"></div>
          <button className="flex items-center justify-center gap-2 w-full mb-6 py-2 transition-colors text-sm font-bold rounded-md" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--primary)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Upgrade to Pro
          </button>

          <div className="flex flex-col gap-1">
            <SidebarItem href="#" icon={<HelpCircle size={18} />} label="Help" />
            <SidebarItem href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === '/settings'} />
          </div>
        </div>
      </aside>

      {/* Secondary Sidebar (Folders & Tags) - Only visible on Notes page */}
      {isNotesPage && isFolderSidebarOpen && (
        <aside style={{ width: '240px', minWidth: '240px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--background)', paddingTop: '2rem' }}>
          <div className="px-4 mb-2">
            <div className="text-[0.65rem] font-bold text-muted tracking-widest uppercase mb-3 px-3">Folders</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { setActiveFolder("Personal"); setActiveTag(""); }}
                className={`flex items-center gap-3 px-6 py-2 w-full transition-colors ${activeFolder === 'Personal' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                <span className="text-sm font-medium">Personal</span>
              </button>
              <button
                onClick={() => { setActiveFolder("Work"); setActiveTag(""); }}
                className={`flex items-center gap-3 px-6 py-2 w-full transition-colors ${activeFolder === 'Work' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                <span className="text-sm font-medium">Work</span>
              </button>
              <button
                onClick={() => { setActiveFolder("Projects"); setActiveTag(""); }}
                className={`flex items-center gap-3 px-6 py-2 w-full transition-colors ${activeFolder === 'Projects' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                <span className="text-sm font-medium">Projects</span>
              </button>
            </div>
          </div>

          <div className="px-4 mt-6 mb-6">
            <div className="text-[0.65rem] font-bold text-muted tracking-widest uppercase mb-3 px-3">Tags Filter</div>
            <div className="flex flex-col gap-2 px-3">
              {['q3-planning', 'ideas', 'meeting-notes', 'design-system', 'marketing'].map(tag => (
                <div
                  key={tag}
                  onClick={() => { setActiveTag(tag); setActiveFolder("all"); }}
                  className="rounded-full border border-border text-[0.7rem] text-secondary px-3 py-1 w-max cursor-pointer hover:border-primary hover:text-primary transition-colors"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  #{tag}
                </div>
              ))}
              <div
                onClick={() => { setActiveTag(""); setActiveFolder("all"); }}
                className="text-[0.6rem] text-muted hover:text-primary cursor-pointer mt-2 px-1 underline"
              >
                Clear Filters
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header className="topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', height: '80px', borderBottom: '1px solid var(--border)', background: 'rgba(18, 20, 28, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div className="flex items-center gap-4 flex-1">
            {isNotesPage && (
              <button
                onClick={() => setIsFolderSidebarOpen(!isFolderSidebarOpen)}
                className="p-2 rounded-md hover:bg-surface-light transition-colors text-secondary hover:text-primary"
                title={isFolderSidebarOpen ? "Hide Folders" : "Show Folders"}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isFolderSidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m14 9 3 3-3 3" /></svg>
                )}
              </button>
            )}
            <div className="relative w-full max-w-md flex items-center">
              <Search size={18} className="absolute" style={{ left: '1rem', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your notes..."
                style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '9999px', padding: '0.625rem 1rem 0.625rem 2.75rem', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', transition: 'all 0.2s ease', boxShadow: 'none' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 245, 212, 0.15)'; e.currentTarget.style.background = 'var(--surface-light)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--surface)'; }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              className="flex items-center gap-2 font-bold cursor-pointer transition-all duration-200"
              onClick={async () => {
                const res = await fetch("/api/notes", { method: "POST", body: JSON.stringify({}) });
                if (res.ok) {
                  const note = await res.json();
                  router.push(`/notes/${note.id}`);
                }
              }}
              style={{ background: 'var(--primary)', color: '#12141C', border: 'none', padding: '0.625rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 245, 212, 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <Plus size={18} /> Create New
            </button>
            <div className="flex items-center gap-5 border-l" style={{ borderColor: 'var(--border)', paddingLeft: '1.5rem' }}>
              <button
                className="relative transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', padding: 0, outline: 'none', display: 'flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ background: 'var(--primary)', borderColor: 'var(--background)' }}></span>
              </button>
              <button
                className="transition-colors cursor-pointer"
                onClick={() => router.push('/settings')}
                style={{ color: pathname === '/settings' ? 'var(--primary)' : 'var(--text-secondary)', background: 'transparent', border: 'none', padding: 0, outline: 'none', display: 'flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = pathname === '/settings' ? 'var(--primary)' : 'var(--text-secondary)'; }}
              >
                <Settings size={22} />
              </button>
              <div
                className="rounded-full overflow-hidden cursor-pointer transition-transform"
                onClick={() => router.push('/profile')}
                style={{ width: '40px', height: '40px', border: pathname === '/profile' ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'var(--surface-light)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = pathname === '/profile' ? 'var(--primary)' : 'var(--border)'; }}
              >
                <img src={`https://ui-avatars.com/api/?name=${session?.user?.name?.replace(' ', '+') || 'User'}&background=1E212B&color=00F5D4`} alt="User avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active
        ? 'bg-surface border-l-2 border-primary text-primary'
        : 'text-secondary hover:text-primary hover:bg-surface-light border-l-2 border-transparent'
        }`}
    >
      <span className={active ? 'text-primary' : 'text-secondary opacity-70'}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
