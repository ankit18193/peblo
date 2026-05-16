/**
 * Multi-Provider AI Orchestrator
 * Priority: Gemini → Groq → HuggingFace → Mock fallback
 */

// ─── TYPE ─────────────────────────────────────────────────────────────────────
export interface AIResult {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
  provider: string;
}

export interface ChatResult {
  response: string;
  provider: string;
}

// ─── SHARED PROMPT BUILDERS ───────────────────────────────────────────────────
function buildSummaryPrompt(content: string): string {
  return `Analyze the following note content and respond ONLY with valid JSON — no markdown, no explanation, no code fences.
Required format:
{
  "summary": "A concise 1-2 sentence summary",
  "actionItems": ["Action 1", "Action 2"],
  "suggestedTitle": "A short catchy title"
}

Note content:
${content}`;
}

function buildChatPrompt(noteTitle: string, noteContent: string, noteSummary: string | null, message: string): string {
  return `You are an AI assistant helping a user with their note titled "${noteTitle}".

Note Context:
---
${noteContent}
---

Summary: ${noteSummary || "No summary yet."}

User's question: "${message}"

Provide a concise, helpful response based on the note content. If the information isn't in the note, you can use general knowledge but mention it's not from the note.`;
}

// ─── PROVIDER 1: GEMINI ───────────────────────────────────────────────────────
async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) throw new Error("No Gemini key");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });
  return response.text ?? "";
}

// ─── PROVIDER 2: GROQ ─────────────────────────────────────────────────────────
async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("No Groq key");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}



// ─── ORCHESTRATOR: Gemini → Groq → Mock ─────────────────────────────────────
async function callAI(prompt: string): Promise<{ text: string; provider: string }> {
  const providers: Array<{ name: string; fn: (p: string) => Promise<string> }> = [
    { name: "gemini", fn: callGemini },
    { name: "groq",   fn: callGroq },
  ];

  const errors: string[] = [];

  for (const { name, fn } of providers) {
    try {
      console.log(`[AI] Trying provider: ${name}`);
      const text = await fn(prompt);
      if (text?.trim()) {
        console.log(`[AI] Success with: ${name}`);
        return { text, provider: name };
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.warn(`[AI] Provider ${name} failed: ${msg}`);
      errors.push(`${name}: ${msg}`);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
}

// ─── PARSE JSON SAFELY ────────────────────────────────────────────────────────
function parseJSONFromText(text: string): any {
  // Strip markdown code fences if present
  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in response");
  return JSON.parse(match[0]);
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Generate AI summary, action items, and title suggestion for a note.
 * Falls back through Gemini → Groq → HuggingFace → Mock.
 */
export async function generateSummary(noteContent: string, noteTitle: string): Promise<AIResult> {
  const prompt = buildSummaryPrompt(noteContent);

  try {
    const { text, provider } = await callAI(prompt);
    const parsed = parseJSONFromText(text);

    return {
      summary: parsed.summary || "Could not generate summary.",
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      suggestedTitle: parsed.suggestedTitle || noteTitle,
      provider,
    };
  } catch (err) {
    console.error("[AI] All providers failed, using mock:", err);

    // Mock fallback — always works, useful for dev without keys
    return {
      summary: `Mock summary for: ${noteContent.substring(0, 60)}...`,
      actionItems: ["Review and expand this note", "Share with collaborators"],
      suggestedTitle: noteTitle || "Untitled Note",
      provider: "mock",
    };
  }
}

/**
 * Chat with the AI about a specific note.
 * Falls back through Gemini → Groq → HuggingFace.
 */
export async function chatWithNote(
  noteTitle: string,
  noteContent: string,
  noteSummary: string | null,
  message: string
): Promise<ChatResult> {
  const prompt = buildChatPrompt(noteTitle, noteContent, noteSummary, message);

  try {
    const { text, provider } = await callAI(prompt);
    return { response: text.trim(), provider };
  } catch (err: any) {
    console.error("[AI] Chat failed:", err);
    return {
      response: "I'm sorry, all AI providers are currently unavailable. Please check your API keys in the environment configuration.",
      provider: "none",
    };
  }
}
