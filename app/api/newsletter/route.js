import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseServer";

export async function POST(request) {
  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("subscribers").insert({ email });

  // Duplicate email is fine — treat as already subscribed, not an error to the user
  if (error && !error.message.includes("duplicate")) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
