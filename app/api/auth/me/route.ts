import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { publicUser, sessionCookieName, userFromSession } from "@/lib/server/auth";

export async function GET() {
  const cookieStore = await cookies();
  const user = userFromSession(cookieStore.get(sessionCookieName())?.value);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: publicUser(user) });
}
