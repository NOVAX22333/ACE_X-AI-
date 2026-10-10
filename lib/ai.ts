export type Msg = { role: "user" | "assistant"; content: string };

type Opts = {
  system: string;
  messages: Msg[];
  maxTokens?: number;
  temperature?: number;
  effort?: "low" | "medium" | "high";
};

export type AIResult = { ok: true; text: string } | { ok: false; status: number; error: string };

export async function callAI(o: Opts): Promise<AIResult> {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim();
  if (!key || !model) {
    return {
      ok: false,
      status: 503,
      error: "The AI is not connected yet. Add OPENROUTER_API_KEY and OPENROUTER_MODEL in your environment settings.",
    };
  }

  const send = (withReasoning: boolean) =>
    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "Ace_X AI",
      },
      body: JSON.stringify({
        model,
        max_tokens: o.maxTokens ?? 4000,
        temperature: o.temperature,
        messages: [{ role: "system", content: o.system }, ...o.messages],
        ...(withReasoning ? { reasoning: { effort: o.effort } } : {}),
      }),
    });

  const useReasoning = !!o.effort && process.env.OPENROUTER_REASONING !== "off";
  let res: Response;
  try {
    res = await send(useReasoning);
    if (!res.ok && useReasoning && res.status === 400) res = await send(false);
  } catch {
    return { ok: false, status: 502, error: "Could not reach the AI service. Try again." };
  }

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.error?.message ?? "";
    } catch {}
    return { ok: false, status: 502, error: `The AI service returned an error (${res.status}). ${detail}`.trim() };
  }

  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  return { ok: true, text };
}
