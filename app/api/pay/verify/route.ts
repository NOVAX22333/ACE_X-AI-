import { NextResponse } from "next/server";
import { getPlan, signToken } from "@/lib/pro";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const ref = (body.reference ?? "").trim();
  if (!/^[A-Za-z0-9_.=-]{6,100}$/.test(ref)) {
    return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });

  let res: Response;
  try {
    res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
  } catch {
    return NextResponse.json({ error: "Could not reach Paystack. Try again." }, { status: 502 });
  }
  const json = await res.json().catch(() => null);
  const d = json?.data;
  if (!res.ok || !json?.status || !d || d.status !== "success") {
    return NextResponse.json({ error: "Payment was not completed." }, { status: 402 });
  }

  const plan = getPlan(d.metadata?.plan);
  if (!plan || d.currency !== "GHS" || d.amount !== plan.amount) {
    return NextResponse.json({ error: "Payment details did not match the plan." }, { status: 400 });
  }

  const paidAt = Date.parse(d.paid_at) || Date.now();
  const baseUntil = Number(d.metadata?.base_until) || 0;
  const until = Math.max(paidAt, baseUntil) + plan.days * 86400000;

  let token: string;
  try {
    token = signToken({ t: "pro", e: String(d.customer?.email ?? ""), u: until });
  } catch {
    return NextResponse.json({ error: "Server setup is incomplete (PRO_TOKEN_SECRET)." }, { status: 503 });
  }
  return NextResponse.json({ token, until, plan: plan.label });
}
