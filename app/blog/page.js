import { createClient } from "@/lib/supabaseServer";
import PostCard from "@/components/PostCard";

export const revalidate = 60;

export const metadata = { title: "Blog" };

export default async function BlogPage({ searchParams }) {
  const supabase = createClient();
  const { category, tag, q } = searchParams || {};

  let query = supabase
    .from("posts")
    .select("*, categories(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category) query = query.eq("categories.slug", category);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data: posts } = await query;
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <div className="mb-12">
        <p className="font-mono text-xs tracking-widest uppercase text-clay mb-2">The Journal</p>
        <h1 className="font-display font-semibold text-4xl md:text-5xl text-pine-deep">All Stories</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-12">
        <form action="/blog" className="flex-1 min-w-[220px]">
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search posts..."
            className="w-full border border-[#D8D3C4] rounded px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-pine"
          />
        </form>
        <a href="/blog" className={`font-mono text-xs px-3 py-2 rounded ${!category ? "bg-pine-deep text-white" : "bg-white border border-[#D8D3C4]"}`}>All</a>
        {categories?.map((c) => (
          <a key={c.id} href={`/blog?category=${c.slug}`} className={`font-mono text-xs px-3 py-2 rounded ${category === c.slug ? "bg-pine-deep text-white" : "bg-white border border-[#D8D3C4]"}`}>
            {c.name}
          </a>
        ))}
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      ) : (
        <p className="text-[#8a8776] text-sm">No posts found.</p>
      )}
    </div>
  );
}
