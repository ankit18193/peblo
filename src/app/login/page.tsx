"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center relative min-h-[80vh]">
      {/* Background magical elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="glass-panel animate-fade-in relative overflow-hidden p-10 w-full max-w-[420px] bg-surface">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#00A690]"></div>
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative bg-surface-light border border-primary/30">
            <div className="absolute inset-0 bg-primary/10 blur-md rounded-2xl"></div>
            <LogIn size={24} className="text-primary relative z-10" />
          </div>
        </div>
        
        <h2 className="text-center mb-2 text-2xl font-heading text-primary">Welcome Back</h2>
        <p className="text-center text-secondary mb-8 text-sm">Enter your details to access your workspace.</p>
        
        {error && (
          <div className="mb-6 p-3 rounded-md flex items-center gap-3 text-xs bg-danger/10 text-danger border border-danger/20">
            <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0"></div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            />
          </div>
          
          <button type="submit" className="btn btn-primary mt-2 group w-full justify-between" disabled={loading}>
            <span>{loading ? "Logging in..." : "Log In"}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-8 pt-6 text-center border-t border-border">
          <p className="text-secondary text-xs">
            Don't have an account? <Link href="/signup" className="text-primary font-semibold hover:text-primary-hover transition-colors">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
