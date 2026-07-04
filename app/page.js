import Link from "next/link";
import { createClient } from "@/lib/supabaseServer";
import PostCard from "@/components/PostCard";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 60; // refresh homepage data every 60s so new posts show up automatically

export default async function HomePage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*, categories(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5);

  const [featured, ...rest] = posts || [];

  return (
    <>
      <section className="relative h-[85vh] min-h-[560px] flex items-end bg-gradient-to-b from-[#2c5246] via-pine-deep to-[#122720] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-8 pb-16 w-full text-ridge">
          <p className="font-mono text-xs tracking-widest uppercase text-[#CFE0D6]/85 mb-5">Field notes from the Nepal Himalaya</p>
          <h1 className="font-display font-semibold text-5xl sm:text-6xl md:text-7xl leading-[0.98] tracking-tight max-w-3xl">
            Exploring Nepal,<br /><em className="italic font-medium text-[#E4C79A]">one trail</em> at a time.
          </h1>
          <p className="text-lg text-[#DCE7DF]/90 mt-6 max-w-md">
            Trekking journals, village stories, and mountain photography from someone who keeps going back for the switchbacks.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="flex justify-between items-baseline mb-11 flex-wrap gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-clay mb-2">Featured Stories</p>
            <h2 className="font-display font-medium text-3xl md:text-4xl text-pine-deep">Where the trail led this season</h2>
          </div>
          <Link href="/blog" className="font-mono text-sm text-pine border-b border-pine">View all posts →</Link>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {featured && (
              <div className="md:row-span-2">
                <PostCard post={featured} featured />
              </div>
            )}
            {rest.slice(0, 2).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <p className="text-[#8a8776] text-sm">No posts published yet — head to the admin dashboard to publish your first story.</p>
        )}
      </section>

      <section className="bg-pine-deep py-16">
        <div className="max-w-6xl mx-auto px-8 flex flex-wrap items-center justify-between gap-8">
          <div>
            <h3 className="font-display font-medium text-3xl text-white mb-2">Trail notes, straight to your inbox.</h3>
            <p className="text-[#DCE7DF]/80 text-sm max-w-sm">New posts, route notes, and the occasional gear recommendation.</p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[380px]">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
