import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByEmail, hashPassword, publicUser, setSessionCookie } from "@/lib/server/auth";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET?.trim()) {
      return NextResponse.json(
        { error: "Authentication is not configured on this server. Set AUTH_SECRET and try again." },
        { status: 503 }
      );
    }
    const input = signupSchema.parse(await request.json());
    const email = input.email.toLowerCase();
    if (findUserByEmail(email)) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = createUser({ name: input.name, email, passwordHash: await hashPassword(input.password) });
    const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
    setSessionCookie(response, user.id);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid name, email, and password of at least 8 characters." }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "The signup request was invalid. Please try again." }, { status: 400 });
    }
    console.error("Signup failed:", error);
    return NextResponse.json({ error: "Unable to create the account." }, { status: 500 });
  }
}
