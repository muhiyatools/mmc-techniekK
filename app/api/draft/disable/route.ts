import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const back = request.nextUrl.searchParams.get("path") ?? "/";
  return NextResponse.redirect(new URL(back.startsWith("/") && !back.startsWith("//") ? back : "/", request.nextUrl.origin));
}
