import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for magic links and invites. Supports both the PKCE `code` flow and the
 * `token_hash` flow (used by the invite / recovery email templates).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = searchParams.get("next");
  const target = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  const supabase = await createClient();

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };

  if (error) return NextResponse.redirect(new URL("/admin/login?error=link", origin));
  // New users from an invite set their password first.
  return NextResponse.redirect(new URL(type === "invite" || type === "recovery" ? "/admin/account?welkom=1" : target, origin));
}
