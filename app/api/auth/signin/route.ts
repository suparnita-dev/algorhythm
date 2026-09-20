import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/server/supabase";

const signinSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const input = signinSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.toLowerCase(),
      password: input.password,
    });
    if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Invalid email or password." }, { status: 401 });
    return NextResponse.json({ user: data.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to sign in. Configure Supabase first." }, { status: 500 });
  }
}
