import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, hasRole } from "@/lib/admin/auth";

/** Preview drafts: editors only. Sets the draft cookie and opens the requested page. */
export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!hasRole(user, "editor")) return new NextResponse("Geen toegang", { status: 403 });
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  const target = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(target, request.nextUrl.origin));
}
