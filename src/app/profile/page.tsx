"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { KeyRound, Check, Award, Zap, FileText, Share2, Star, Target } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const name = session?.user?.name || "Alex Chen";
  const email = session?.user?.email || "alex@peblo.io";
  const avatarUrl = session?.user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2A2E3D&color=FFFFFF&size=150`;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 style={{ fontSize: "2.6rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "10px" }}>
          User Profile
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Overview of your activity, achievements, and account details.
        </p>
      </div>

      {/* MAIN GRID — matches Settings layout: left (wider) + right (narrower) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.85fr 1fr", gap: "24px", alignItems: "start" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* 1. IDENTITY CARD */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" }}>
                <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 12 }}>{email}</div>
                <div style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,245,212,0.25)",
                  background: "rgba(0,245,212,0.05)",
                  color: "var(--primary)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}>
                  Member since Oct 2023
                </div>
              </div>
            </div>
          </div>

          {/* 2. ACTIVITY STATS */}
          <div style={card}>
            <div style={sectionTitle}>Activity Overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
              <StatBox icon={<FileText size={18} />} value="12" label="Total Notes" />
              <StatBox icon={<Share2 size={18} />} value="4" label="Shared Notes" />
              <StatBox icon={<Zap size={18} />} value="156" label="AI Summaries" />
            </div>
          </div>

          {/* 3. PROFILE PREFERENCES */}
          <div style={card}>
            <div style={sectionTitle}>Profile Preferences</div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column" }}>
              <PrefRow
                title="Email Notifications"
                desc="Receive updates and activity alerts via email."
                active={emailNotifs}
                onToggle={() => setEmailNotifs(!emailNotifs)}
                first
              />
              <PrefRow
                title="AI Suggestions"
                desc="Allow AI to suggest completions and formatting."
                active={aiSuggestions}
                onToggle={() => setAiSuggestions(!aiSuggestions)}
              />
              <PrefRow
                title="Public Profile"
                desc="Let others find and view your shared notes."
                active={publicProfile}
                onToggle={() => setPublicProfile(!publicProfile)}
                last
              />
            </div>
          </div>

          {/* 4. ACHIEVEMENTS */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={sectionTitle}>Achievements</div>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>
                2 / 4 Unlocked
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
              <AchievementItem icon={<Star size={16} />} title="Early Adopter" date="May 12, 2026" unlocked />
              <AchievementItem icon={<Zap size={16} />} title="Neural Link" date="May 14, 2026" unlocked />
              <AchievementItem icon={<Target size={16} />} title="Content Titan" date="In Progress" unlocked={false} />
              <AchievementItem icon={<Award size={16} />} title="Collaborator" date="In Progress" unlocked={false} />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* PRO PLAN */}
          <div style={{ ...card, border: "1px solid rgba(0,245,212,0.15)", background: "#1A1C23" }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>Pro Plan</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 24 }}>
              Your next billing date is Dec 1, 2023.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={btnPrimary}>Manage Subscription</button>
              <button style={btnOutline}>View Invoices</button>
            </div>
          </div>

          {/* SECURITY */}
          <div style={card}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: 20 }}>Security</div>

            <button style={{ ...btnSecondary, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              <KeyRound size={15} /> Change Password
            </button>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>Two-Factor Auth</span>
                <Toggle active={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 6 }}>
                Add an extra layer of security to your account.
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div style={{ ...card, border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.02)" }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#EF4444", marginBottom: 8 }}>Danger Zone</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 20 }}>
              Permanently delete your account and all associated data.
            </div>
            <button style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 10,
              border: "1px solid rgba(239,68,68,0.2)",
              background: "transparent",
              color: "#EF4444",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}>
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ background: "#0B0D11", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "20px 16px" }}>
      <div style={{ color: "var(--text-secondary)", marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

function PrefRow({ title, desc, active, onToggle, first = false, last = false }: any) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: first ? "0 0 22px" : last ? "22px 0 0" : "22px 0",
      borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)",
    }}>
      <div>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#fff", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{desc}</div>
      </div>
      <Toggle active={active} onToggle={onToggle} />
    </div>
  );
}

function AchievementItem({ icon, title, date, unlocked }: any) {
  return (
    <div style={{
      padding: "16px",
      borderRadius: 12,
      border: `1px solid ${unlocked ? "rgba(0,245,212,0.1)" : "rgba(255,255,255,0.04)"}`,
      background: unlocked ? "rgba(0,245,212,0.03)" : "transparent",
      display: "flex",
      alignItems: "center",
      gap: 12,
      opacity: unlocked ? 1 : 0.4,
    }}>
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: unlocked ? "var(--primary)" : "rgba(255,255,255,0.06)",
        color: unlocked ? "#000" : "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{title}</div>
        <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-secondary)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{date}</div>
      </div>
    </div>
  );
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: "relative",
        width: 48,
        height: 26,
        borderRadius: 999,
        background: active ? "var(--primary)" : "#2D313E",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.25s",
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: active ? "#000" : "#667085",
        transform: active ? "translateX(22px)" : "translateX(0)",
        transition: "transform 0.25s, background 0.25s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {active && <Check size={11} strokeWidth={4} color="var(--primary)" />}
      </div>
    </button>
  );
}

/* ── SHARED STYLES ── */

const card: React.CSSProperties = {
  background: "#1A1C23",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 18,
  padding: "28px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 800,
  color: "#fff",
  letterSpacing: "-0.01em",
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "12px 0",
  borderRadius: 10,
  background: "var(--primary)",
  color: "#000",
  fontWeight: 800,
  fontSize: "0.85rem",
  border: "none",
  cursor: "pointer",
  letterSpacing: "0.01em",
};

const btnOutline: React.CSSProperties = {
  width: "100%",
  padding: "12px 0",
  borderRadius: 10,
  background: "transparent",
  color: "var(--primary)",
  fontWeight: 700,
  fontSize: "0.85rem",
  border: "1px solid rgba(0,245,212,0.2)",
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 10,
  background: "#2D313E",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.85rem",
  border: "none",
  cursor: "pointer",
};