"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, LogOut, LayoutDashboard, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="glass sticky top-0 z-50 mb-8" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(9, 9, 11, 0.7)' }}>
      <div className="container flex justify-between items-center" style={{ height: '4.5rem' }}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="glass flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-glow" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)' }}>
            <BookOpen className="text-primary" size={20} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Peblo
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-secondary mr-4" style={{ fontSize: '0.9rem' }}>
                <User size={16} />
                <span>{session.user?.name}</span>
              </div>
              <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-secondary text-danger hover:border-danger hover:bg-danger/10" style={{ padding: '0.6rem 1rem' }}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>Log In</Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
