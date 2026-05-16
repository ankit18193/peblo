"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center relative min-h-[80vh]">
      {/* Background magical elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="glass-panel animate-fade-in relative overflow-hidden p-10 w-full max-w-[420px] bg-surface">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-[#FF8C00]"></div>
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative bg-surface-light border border-accent/30">
            <div className="absolute inset-0 bg-accent/10 blur-md rounded-2xl"></div>
            <UserPlus size={24} className="text-accent relative z-10" />
          </div>
        </div>
        
        <h2 className="text-center mb-2 text-2xl font-heading text-primary">Create Account</h2>
        <p className="text-center text-secondary mb-8 text-sm">Join Peblo to start your AI learning journey.</p>
        
        {error && (
          <div className="mb-6 p-3 rounded-md flex items-center gap-3 text-xs bg-danger/10 text-danger border border-danger/20">
            <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0"></div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted mb-2 font-bold block">Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Walker"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted mb-2 font-bold block">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted mb-2 font-bold block">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn mt-2 group w-full justify-between bg-accent hover:bg-accent-hover text-[#000] border-none shadow-[0_0_15px_rgba(255,184,0,0.4)]" disabled={loading}>
            <span>{loading ? "Creating..." : "Sign Up"}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-8 pt-6 text-center border-t border-border">
          <p className="text-secondary text-xs">
            Already have an account? <Link href="/login" className="text-accent font-semibold hover:text-accent-hover transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
