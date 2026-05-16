"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { KeyRound, Check } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [aiCompanion, setAiCompanion] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const name = session?.user?.name || "Alex Chen";
  const email = session?.user?.email || "alex@peblo.io";
  const avatarUrl =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2A2E3D&color=FFFFFF&size=150`;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12">

      {/* PAGE HEADER */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>
          Account Settings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Manage your profile, preferences, and security settings.
        </p>
      </div>

      {/* MAIN GRID */}
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

          {/* 2. PERSONAL INFORMATION */}
          <div style={card}>
            <div style={sectionTitle}>Personal Information</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, marginBottom: 28 }}>
              <div>
                <div style={fieldLabel}>Full Name</div>
                <input
                  type="text"
                  defaultValue={name}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                />
              </div>
              <div>
                <div style={fieldLabel}>Email Address</div>
                <input
                  type="email"
                  defaultValue={email}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={btnSecondary}>Save Changes</button>
            </div>
          </div>

          {/* 3. WORKSPACE PREFERENCES */}
          <div style={card}>
            <div style={sectionTitle}>Workspace Preferences</div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
              <PrefRow
                title="Dark Mode"
                desc="Use dark theme by default."
                active={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
                first
              />
              <PrefRow
                title="Auto-save Notes"
                desc="Automatically save changes while editing."
                active={autoSave}
                onToggle={() => setAutoSave(!autoSave)}
              />
              <PrefRow
                title="Enable AI Companion"
                desc="Allow AI to suggest completions and formatting."
                active={aiCompanion}
                onToggle={() => setAiCompanion(!aiCompanion)}
                last
              />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* PRO PLAN */}
          <div style={{ ...card, border: "1px solid rgba(0,245,212,0.15)" }}>
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

            <button
              style={{ ...btnSecondary, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}
            >
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

const fieldLabel: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 8,
  fontFamily: "monospace",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s",
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
  padding: "11px 20px",
  borderRadius: 10,
  background: "#2D313E",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.85rem",
  border: "none",
  cursor: "pointer",
};
