"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Edit3, Share2, BarChart2, ArrowRight, ShieldCheck, Zap, Smile } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-16">
      
      {/* Hero Section */}
      <div className="animate-fade-in flex flex-col items-center text-center mx-auto px-4" style={{ maxWidth: '850px' }}>
        <div 
          className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold"
          style={{ 
            color: 'var(--primary)', 
            background: 'rgba(0, 245, 212, 0.1)', 
            border: '1px solid rgba(0, 245, 212, 0.2)',
            boxShadow: '0 0 20px rgba(0,245,212,0.15)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Meet your new AI-powered learning universe</span>
        </div>
        
        <h1 className="mb-6 font-heading font-bold leading-tight" style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}>
          Learn, Create, and <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(0, 245, 212, 0.4)' }}>Grow</span> with Peblo
        </h1>
        
        <p className="mb-12 text-secondary text-lg md:text-xl leading-relaxed" style={{ maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          Peblo is a magical collaborative workspace designed specifically for children. Write stories, discover new ideas, and let your very own AI Buddy provide summaries and helpful insights.
        </p>
        
        <div className="flex justify-center gap-4 mb-20 flex-wrap">
          <Link href="/signup" className="btn group px-8 py-4 text-base" style={{ background: 'var(--primary)', color: '#000', borderRadius: '99px', fontWeight: 600, boxShadow: '0 0 25px rgba(0,245,212,0.35)' }}>
            Get Started for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-2" />
          </Link>
          <Link href="/login" className="btn px-8 py-4 text-base" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '99px', fontWeight: 600 }}>
            Log In
          </Link>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="w-full border-y border-border py-12 mb-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(30, 33, 43, 0.5), transparent)' }}>
        <p className="text-center text-sm text-muted uppercase tracking-widest font-bold mb-8">Trusted by parents and educators</p>
        <div className="flex justify-center gap-12 md:gap-24 opacity-50 grayscale flex-wrap px-4">
          <div className="text-xl font-heading font-bold">EdTech Innovators</div>
          <div className="text-xl font-heading font-bold">LearningFirst</div>
          <div className="text-xl font-heading font-bold">KidsAcademy</div>
          <div className="text-xl font-heading font-bold">FutureScholars</div>
        </div>
      </div>
      
      {/* Features Grid Section */}
      <div className="relative w-full mx-auto px-6 mb-32" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4 text-primary">Everything you need to learn</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">Our platform combines the simplicity of digital notes with the magic of advanced AI to accelerate childhood learning.</p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none -z-10" style={{ background: 'rgba(0, 245, 212, 0.03)', filter: 'blur(120px)' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Edit3 size={22} color="var(--primary)" />}
            title="Smart Notebooks"
            desc="A beautiful, distraction-free environment for kids to write down their thoughts, daily journals, or school projects."
          />
          <FeatureCard 
            icon={<Zap size={22} color="var(--accent)" />}
            title="AI Buddy Insights"
            desc="Click one button and our safe AI will instantly summarize your notes and extract a checklist of action items."
          />
          <FeatureCard 
            icon={<Share2 size={22} color="var(--success)" />}
            title="Public Sharing"
            desc="Easily share your proudest creations with friends or parents using a secure, read-only public link."
          />
          <FeatureCard 
            icon={<ShieldCheck size={22} color="#A78BFA" />}
            title="Safe & Secure"
            desc="Built with privacy from the ground up. The AI is specifically prompted to be kid-friendly and highly educational."
          />
          <FeatureCard 
            icon={<BarChart2 size={22} color="#F472B6" />}
            title="Progress Dashboard"
            desc="Track how many notes you've written, what topics you explore the most, and view a visual chart of your weekly activity."
          />
          <FeatureCard 
            icon={<Smile size={22} color="#38BDF8" />}
            title="Fun & Engaging"
            desc="A premium dark-mode interface with subtle animations and glowing colors that makes learning feel like a superpower."
          />
        </div>
      </div>

      {/* How it Works Section */}
      <div className="w-full border-y border-border py-24 mb-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--background), var(--surface-light) 50%, var(--background))' }}>
        
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at center, rgba(0, 245, 212, 0.05) 0%, transparent 70%)' }}></div>

        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-heading font-bold mb-6 text-primary">How Peblo Works</h2>
              <p className="text-secondary text-lg mb-10 leading-relaxed">We've stripped away all the confusing menus and complicated tools to give kids a straightforward path from blank page to brilliant idea.</p>
              
              <div className="flex flex-col gap-8">
                <div className="flex gap-5 items-start">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 245, 212, 0.15)', border: '1px solid rgba(0, 245, 212, 0.3)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>1</div>
                  <div>
                    <h4 className="text-xl font-heading font-bold mb-2">Create your workspace</h4>
                    <p className="text-secondary leading-relaxed">Sign up in seconds and get instant access to your personal dashboard.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 184, 0, 0.15)', border: '1px solid rgba(255, 184, 0, 0.3)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>2</div>
                  <div>
                    <h4 className="text-xl font-heading font-bold mb-2">Write your first note</h4>
                    <p className="text-secondary leading-relaxed">Type out a story, an essay, or just brainstorm ideas. Peblo auto-saves instantly.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>3</div>
                  <div>
                    <h4 className="text-xl font-heading font-bold mb-2">Activate the AI Buddy</h4>
                    <p className="text-secondary leading-relaxed">Hit the "Generate Insights" button to get an intelligent summary and next steps.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {/* Mock UI Representation */}
              <div className="w-full h-[400px] border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative" style={{ background: 'var(--background)', transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}>
                
                {/* Window Header */}
                <div className="h-12 border-b border-border flex items-center px-5 gap-2" style={{ background: 'var(--surface-light)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }}></div>
                </div>
                
                {/* Window Content */}
                <div className="flex-1 flex p-6 gap-6 relative" style={{ background: 'var(--background)' }}>
                  {/* Left Column (Editor) */}
                  <div className="flex-[2] flex flex-col gap-5">
                    <div style={{ width: '85%', height: '32px', borderRadius: '8px', background: 'var(--surface-light)' }}></div>
                    <div style={{ width: '100%', height: '16px', borderRadius: '4px', background: 'var(--surface)', marginTop: '10px' }}></div>
                    <div style={{ width: '100%', height: '16px', borderRadius: '4px', background: 'var(--surface)' }}></div>
                    <div style={{ width: '90%', height: '16px', borderRadius: '4px', background: 'var(--surface)' }}></div>
                    <div style={{ width: '95%', height: '16px', borderRadius: '4px', background: 'var(--surface)' }}></div>
                  </div>
                  
                  {/* Right Column (AI Assistant) */}
                  <div className="flex-[1] border-l border-border pl-6 flex flex-col gap-5">
                    <div style={{ width: '100%', height: '40px', borderRadius: '8px', background: 'rgba(0, 245, 212, 0.15)', border: '1px solid rgba(0, 245, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '40%', height: '12px', borderRadius: '4px', background: 'var(--primary)' }}></div>
                    </div>
                    <div style={{ flex: 1, borderRadius: '8px', background: 'var(--surface-light)', border: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ width: '30%', height: '10px', borderRadius: '4px', background: 'var(--secondary)', opacity: 0.5 }}></div>
                      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--surface)' }}></div>
                      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--surface)' }}></div>
                      <div style={{ width: '80%', height: '8px', borderRadius: '4px', background: 'var(--surface)' }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating cursor mock clicking the generate button */}
                <div className="absolute" style={{ top: '35%', right: '15%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.33967 1.8483C3.65586 1.13783 2.5 1.6223 2.5 2.6133V20.2452C2.5 21.3283 3.86477 21.7964 4.52044 20.9388L9.12458 14.9168C9.30908 14.6755 9.59604 14.5312 9.89926 14.5312H18.9103C19.9248 14.5312 20.3957 13.2662 19.6384 12.6075L4.33967 1.8483Z" fill="var(--primary)" stroke="#12141C" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  {/* Subtle click ripple effect */}
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full border border-primary animate-ping" style={{ animationDuration: '2s', opacity: 0.5 }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full max-w-[1000px] mx-auto px-6 mb-20">
        <div className="glass-panel p-12 md:p-16 text-center rounded-3xl relative overflow-hidden" style={{ border: '1px solid rgba(0, 245, 212, 0.3)', background: 'linear-gradient(180deg, var(--surface) 0%, rgba(0, 245, 212, 0.05) 100%)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-secondary text-lg mb-10 max-w-xl mx-auto">Join thousands of kids already using Peblo to make learning an interactive, magical experience.</p>
          
          <Link href="/signup" className="btn inline-flex group px-10 py-4 text-lg" style={{ background: 'var(--primary)', color: '#000', borderRadius: '99px', fontWeight: 700, boxShadow: '0 0 30px rgba(0,245,212,0.4)' }}>
            Create Your Free Account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-2" />
          </Link>
        </div>
      </div>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel glass-panel-hover relative overflow-hidden group flex flex-col h-full bg-surface" style={{ padding: '2rem', minHeight: '260px' }}>
      
      {/* Icon Container specifically styled to center the icon */}
      <div 
        className="mb-6 flex-shrink-0"
        style={{ 
          width: '56px', 
          height: '56px',
          borderRadius: '16px',
          background: 'var(--surface-light)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
      
      <h3 className="mb-3 text-xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-secondary leading-relaxed text-sm flex-1">{desc}</p>
      
      {/* Subtle bottom border highlight on hover */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
