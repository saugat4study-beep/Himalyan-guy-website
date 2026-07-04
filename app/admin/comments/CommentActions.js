"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function CommentActions({ id, status }) {
  const router = useRouter();
  const supabase = createClient();

  async function approve() {
    await supabase.from("comments").update({ status: "approved" }).eq("id", id);
    router.refresh();
  }
  async function remove() {
    if (!confirm("Delete this comment?")) return;
    await supabase.from("comments").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="flex gap-4 font-mono text-[11px]">
      {status === "pending" && <button onClick={approve} className="text-glacier">Approve</button>}
      <button onClick={remove} className="text-flag">Delete</button>
    </div>
  );
}
