import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import DeletePostButton from "./DeletePostButton";

export default async function AdminPostsPage() {
  const supabase = createClient();
  const { data: posts } = await supabase.from("posts").select("*, categories(name)").order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-semibold text-2xl text-pine-deep">All Posts</h1>
        <Link href="/admin/posts/new" className="bg-pine-deep text-white text-sm font-medium px-4.5 py-2.5 rounded">+ New Post</Link>
      </div>
      <div className="bg-white border border-pine/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FBF9F4] border-b border-pine/10">
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Title</th>
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Category</th>
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Status</th>
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p) => (
              <tr key={p.id} className="border-b border-pine/10 last:border-0">
                <td className="px-5 py-4 font-medium text-pine-deep">{p.title}</td>
                <td className="px-5 py-4">{p.categories?.name || "—"}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex gap-4 font-mono text-[11.5px]">
                    <Link href={`/admin/posts/${p.id}`} className="text-glacier">Edit</Link>
                    {p.status === "published" && <a href={`/blog/${p.slug}`} target="_blank" className="text-glacier">View</a>}
                    <DeletePostButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-[#8a8776] text-sm">No posts yet — create your first one.</td></tr>
            )}
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
