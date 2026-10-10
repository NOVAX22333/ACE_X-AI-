import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { isPro } from "@/lib/pro";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = [
  "You are a patient maths and science teacher who explains formulas to students. Answer in Markdown with LaTeX maths ($...$ inline, $$...$$ display).",
  "Use exactly these sections as ## headings, in this order:",
  "## Formula",
  "## What each symbol means",
  "## Where it comes from (derivation) - step by step, each step on its own line",
  "## Who developed it - name, period and a short story. If you are not sure of the person or the date, say that the attribution is uncertain. Never invent names or dates.",
  "## Worked example - with numbers, solved fully",
  "## How to memorise it - a mnemonic or a simple trick",
  "## Common mistakes",
  "## Related formulas",
  "If the request is not a formula, law, rule or identity, say so and suggest what the student may mean.",
  "If the request names a topic with several formulas, explain the main one fully and list the others briefly under Related formulas.",
  "Check every step of the derivation and the numbers in the example before answering. Reply in the language the student writes in.",
].join("\n");

export async function POST(req: Request) {
  if (!isPro(req)) {
    return NextResponse.json({ error: "Formula Hub is a Pro feature. Upgrade to continue." }, { status: 402 });
  }
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const query = (body.query ?? "").trim().slice(0, 150);
  if (!query) return NextResponse.json({ error: "Type a formula or law first." }, { status: 400 });

  const r = await callAI({
    system: SYSTEM,
    messages: [{ role: "user", content: query }],
    maxTokens: 5000,
    temperature: 0.3,
    effort: "medium",
  });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json({ reply: r.text || "No reply from the AI. Try again." });
}
