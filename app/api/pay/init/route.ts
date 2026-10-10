import { NextResponse } from "next/server";
import { getPlan, readToken } from "@/lib/pro";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { plan?: string; email?: string; baseToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const planId = body.plan ?? "";
  const plan = getPlan(planId);
  const email = (body.email ?? "").trim().toLowerCase();
  if (!plan) return NextResponse.json({ error: "Choose a plan." }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "A valid email is needed." }, { status: 400 });

  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });

  // If the user is already Pro, the new time is added after their current expiry.
  const base = readToken(body.baseToken);
  const baseUntil = base && base.t === "pro" ? base.u : 0;
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin).replace(/\/+$/, "");

  let res: Response;
  try {
    res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: plan.amount,
        currency: "GHS",
        callback_url: `${site}/`,
        metadata: { plan: planId, base_until: baseUntil },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach Paystack. Try again." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status || !data?.data?.authorization_url) {
    return NextResponse.json({ error: data?.message ?? "Paystack could not start the payment." }, { status: 502 });
  }
  return NextResponse.json({ url: data.data.authorization_url, reference: data.data.reference });
}
