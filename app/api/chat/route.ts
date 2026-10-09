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

  const key = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  if (!key || !model) {
    return NextResponse.json({
      reply:
        "The AI is not connected yet. Add OPENROUTER_API_KEY and OPENROUTER_MODEL in your environment settings.",
    });
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "Ace_X AI",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: "system", content: SYSTEM }, ...messages],
    }),
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "The AI service returned an error. Try again." },
      { status: 502 }
    );
  }

  const data = await res.json();
  const reply: string = data.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ reply: reply || "No reply from the AI. Try again." });
         }
