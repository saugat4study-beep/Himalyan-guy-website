import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const supabase = createClient();
  const [{ count: publishedCount }, { count: pendingComments }, { count: subCount }, { data: recentPosts }] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Published Posts", val: publishedCount ?? 0 },
    { label: "Newsletter Subs", val: subCount ?? 0 },
    { label: "Pending Comments", val: pendingComments ?? 0 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-semibold text-2xl text-pine-deep">Dashboard</h1>
        <Link href="/admin/posts/new" className="bg-pine-deep text-white text-sm font-medium px-4.5 py-2.5 rounded">+ New Post</Link>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-pine/10 rounded p-5">
            <div className="font-mono text-[10.5px] uppercase tracking-wide text-[#8a8776] mb-2">{s.label}</div>
            <div className="font-display text-3xl font-semibold text-pine-deep">{s.val}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-pine/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FBF9F4] border-b border-pine/10">
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Recent Post</th>
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Status</th>
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Created</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts?.map((p) => (
              <tr key={p.id} className="border-b border-pine/10 last:border-0">
                <td className="px-5 py-4"><Link href={`/admin/posts/${p.id}`} className="font-medium text-pine-deep">{p.title}</Link></td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4 font-mono text-xs text-[#6B6A60]">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    published: "bg-[#DEEAE2] text-pine",
    draft: "bg-[#EFE7D8] text-clay",
    scheduled: "bg-[#DCE7EE] text-glacier",
  };
  return <span className={`font-mono text-[10.5px] px-2.5 py-1 rounded-full ${map[status] || ""}`}>{status}</span>;
}
