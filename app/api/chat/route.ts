import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are Ace_X AI, a friendly coding and study assistant for students. " +
  "Explain step by step, keep answers clear, and double-check maths before answering.";

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let messages = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20);
  while (messages.length && messages[0].role !== "user") messages = messages.slice(1);
  if (!messages.length) return NextResponse.json({ error: "Send a message first." }, { status: 400 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({
      reply: "The AI is not connected yet. Add ANTHROPIC_API_KEY in your environment settings.",
    });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
      max_tokens: 1024,
      system: SYSTEM,
      messages,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "The AI service returned an error. Try again." }, { status: 502 });

  const data = await res.json();
  const reply = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n");
  return NextResponse.json({ reply });
}
