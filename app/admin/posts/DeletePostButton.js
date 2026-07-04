"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function DeletePostButton({ id }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this post permanently?")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    router.refresh();
  }

  return <button onClick={handleDelete} className="text-flag">Delete</button>;
}
