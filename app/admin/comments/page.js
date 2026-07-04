import { createClient } from "@/lib/supabaseServer";
import { format } from "date-fns";
import CommentActions from "./CommentActions";

export default async function AdminCommentsPage() {
  const supabase = createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*, posts(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-pine-deep mb-8">Comments</h1>
      <div className="bg-white border border-pine/10 rounded divide-y divide-pine/10">
        {comments?.map((c) => (
          <div key={c.id} className="p-5">
            <div className="font-mono text-[11px] text-[#8a8776] mb-1.5">
              {c.name} · on &ldquo;{c.posts?.title}&rdquo; · {format(new Date(c.created_at), "MMM d, yyyy, h:mm a")}
              {c.status === "pending" && <span className="ml-2 text-clay">· pending</span>}
            </div>
            <p className="text-sm text-[#333] mb-2.5">{c.content}</p>
            <CommentActions id={c.id} status={c.status} />
          </div>
        ))}
        {!comments?.length && <p className="p-8 text-center text-sm text-[#8a8776]">No comments yet.</p>}
      </div>
    </div>
  );
}
