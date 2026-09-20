import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server/supabase";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: data.user });
}
