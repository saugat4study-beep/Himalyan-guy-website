import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseServer";
import { sendContactNotification } from "@/lib/email";

export async function POST(request) {
  const { name, email, subject, message } = await request.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("messages").insert({ name, email, subject, message });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendContactNotification({ name, email, subject, message });
  } catch (e) {
    // Message is saved even if the email notification fails — don't block the user on it
    console.error("Email notification failed:", e);
  }

  return NextResponse.json({ ok: true });
}
