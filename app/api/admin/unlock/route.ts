import crypto from "crypto";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/pro";

export const runtime = "nodejs";

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

export async function POST(req: Request) {
  const expected = process.env.ADMIN_CODE;
  if (!expected) return NextResponse.json({ error: "Admin is not set up." }, { status: 503 });

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ok = crypto.timingSafeEqual(sha(body.code ?? ""), sha(expected));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Wrong admin code." }, { status: 401 });
  }

  try {
    return NextResponse.json({ token: signToken({ t: "admin", e: "admin", u: Date.now() + 12 * 3600 * 1000 }) });
  } catch {
    return NextResponse.json({ error: "Server setup is incomplete (PRO_TOKEN_SECRET)." }, { status: 503 });
  }
}
