import crypto from "crypto";

export type Plan = { amount: number; days: number; label: string };

// amount is in pesewas (GH₵1 = 100)
export const PLANS: Record<string, Plan> = {
  w1: { amount: 200, days: 7, label: "1 week" },
  w2: { amount: 400, days: 14, label: "2 weeks" },
  w3: { amount: 600, days: 21, label: "3 weeks" },
  m1: { amount: 800, days: 30, label: "1 month" },
  m5: { amount: 4000, days: 150, label: "5 months" },
  y1: { amount: 10000, days: 365, label: "1 year" },
};

export function getPlan(id: unknown): Plan | null {
  return typeof id === "string" && Object.prototype.hasOwnProperty.call(PLANS, id) ? PLANS[id] : null;
}

export type Payload = { t: "pro" | "admin"; e: string; u: number };

const enc = (s: string) => Buffer.from(s).toString("base64url");

function secret(): string {
  const s = process.env.PRO_TOKEN_SECRET;
  if (!s || s.length < 16) throw new Error("PRO_TOKEN_SECRET is missing or too short");
  return s;
}

export function signToken(p: Payload): string {
  const body = enc(JSON.stringify(p));
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readToken(tok: string | null | undefined): Payload | null {
  try {
    if (!tok) return null;
    const [body, sig] = tok.split(".");
    if (!body || !sig) return null;
    const expect = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expect);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (!p || typeof p.u !== "number" || p.u < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

export function isPro(req: Request): boolean {
  return readToken(req.headers.get("x-pro-token")) !== null;
}
