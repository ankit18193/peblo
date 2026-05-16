import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import AppShell from "@/components/AppShell";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Peblo Notes - Collaborative AI Workspace",
  description: "AI-powered notes workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${hanken.variable} ${jetbrains.variable} ${lora.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <WorkspaceProvider>
            <AppShell>
              {children}
            </AppShell>
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
