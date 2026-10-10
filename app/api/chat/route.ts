import { NextResponse } from "next/server";
import { callAI, type Msg } from "@/lib/ai";
import { isPro } from "@/lib/pro";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE = [
  "You are Ace_X AI, a friendly and highly accurate coding and study assistant for students.",
  "Always reply in the same language the user writes in (for example Italian, French or Spanish). If the user switches language, switch with them.",
  "Format answers with Markdown: short headings, lists and code blocks when useful.",
  "MATHS RULES: Work every problem out step by step before you state the answer. Put each step on its own line in LaTeX. Write all maths in LaTeX: inline as $...$ and display equations as $$...$$.",
  "Use proper symbols: \\times, \\div, \\sqrt{}, \\frac{}{}, \\sum, \\int, \\pi, \\theta, \\le, \\ge, \\ne, \\approx, \\to, \\infty, x^{2}. Never write fractions, powers or roots as plain text such as 3/13, x^2 or sqrt(x).",
  "After solving, check the result by substituting back or by a second method, and say what the check showed. Give exact values first, then decimals, and include units. If you are not sure, say so instead of guessing.",
  "End maths answers with a clear line: **Answer:** followed by the result in LaTeX.",
  "When the user asks you to draw, sketch or make a diagram, reply with ONE complete SVG inside a ```svg code block: set a viewBox, use clear labels, simple shapes and readable colours, and no scripts. Then explain the diagram briefly.",
].join(" ");

const VERIFY = [
  "You are a meticulous maths and science checker.",
  "You will receive a question and an answer that was given. Solve the question again yourself, independently, then compare.",
  "Start with either ✅ **Correct** or ❌ **Incorrect**. If incorrect, show the corrected working step by step and the right final answer.",
  "Write all maths in LaTeX ($...$ inline, $$...$$ display). Reply in the language of the question.",
].join(" ");

export async function POST(req: Request) {
  let body: { messages?: Msg[]; mode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let messages = (body.messages ?? [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-20);
  while (messages.length && messages[0].role !== "user") messages = messages.slice(1);
  if (!messages.length) {
    return NextResponse.json({ error: "Send a message first." }, { status: 400 });
  }

  const mode = body.mode === "verify" || body.mode === "diagram" ? body.mode : "chat";
  if (mode !== "chat" && !isPro(req)) {
    return NextResponse.json({ error: "This is a Pro feature. Upgrade to continue." }, { status: 402 });
  }

  const r = await callAI({
    system: mode === "verify" ? VERIFY : BASE,
    messages,
    maxTokens: 4000,
    temperature: mode === "verify" ? 0.1 : 0.3,
    effort: mode === "verify" ? "high" : "medium",
  });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json({ reply: r.text || "No reply from the AI. Try again or choose another model." });
}
