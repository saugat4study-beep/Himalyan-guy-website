import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseServer";
import { sendCommentNotification } from "@/lib/email";

export async function POST(request) {
  const { postId, postTitle, parentId, name, email, content } = await request.json();
  if (!postId || !name || !email || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, parent_id: parentId || null, name, email, content, status: "pending" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendCommentNotification({ name, email, postTitle, content });
  } catch (e) {
    console.error("Email notification failed:", e);
  }

  return NextResponse.json({ ok: true, comment: data });
}
