import { NextResponse } from "next/server";
import { z } from "zod";

import { findUserByEmail, publicUser, setSessionCookie, verifyPassword } from "@/lib/server/auth";

const signinSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const input = signinSchema.parse(await request.json());
    const user = findUserByEmail(input.email);
    const valid = user ? await verifyPassword(input.password, user.passwordHash) : false;
    if (!user || !valid) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    const response = NextResponse.json({ user: publicUser(user) });
    setSessionCookie(response, user.id);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
