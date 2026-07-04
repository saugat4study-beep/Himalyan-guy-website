import { createClient } from "@/lib/supabaseServer";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";

export const revalidate = 60;

async function getPost(slug) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return post;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }) {
  const supabase = createClient();
  const post = await getPost(params.slug);
  if (!post) notFound();

  const [{ data: comments }, { data: related }] = await Promise.all([
    supabase.from("comments").select("*").eq("post_id", post.id).eq("status", "approved").is("parent_id", null).order("created_at", { ascending: false }),
    supabase.from("posts").select("*, categories(name)").eq("status", "published").neq("id", post.id).eq("category_id", post.category_id).limit(3),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    author: { "@type": "Person", name: post.author_name },
    description: post.excerpt,
    image: post.featured_image,
  };

  return (
    <article className="max-w-3xl mx-auto px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="font-mono text-[11px] text-[#8a8776] mb-8">
        <a href="/">Home</a> / <a href="/blog">Blog</a> / <span className="text-ink">{post.title}</span>
      </nav>

      {post.categories?.name && (
        <p className="font-mono text-xs tracking-widest uppercase text-clay mb-3">{post.categories.name}</p>
      )}
      <h1 className="font-display font-semibold text-4xl md:text-5xl text-pine-deep leading-tight mb-5">{post.title}</h1>
      <div className="font-mono text-[12px] text-[#6B6A60] flex gap-5 mb-10">
        <span>{post.author_name}</span>
        <span>{post.published_at && format(new Date(post.published_at), "MMMM d, yyyy")}</span>
        <span>{post.reading_time || 5} MIN READ</span>
      </div>

      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} className="w-full rounded-sm mb-10" />
      )}

      <div className="prose-himalaya text-[15.5px]" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

      <div className="flex gap-3 mt-10 pt-8 border-t border-pine/10 font-mono text-xs">
        <span className="text-[#8a8776]">Share:</span>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} className="text-glacier">X</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=`} className="text-glacier">Facebook</a>
        <a href="#" className="text-glacier">Copy Link</a>
      </div>

      {related && related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-pine/10">
          <h3 className="font-display text-2xl font-medium text-pine-deep mb-7">Related Stories</h3>
          <div className="grid sm:grid-cols-3 gap-8">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      )}

      <CommentSection postId={post.id} postTitle={post.title} initialComments={comments || []} />
    </article>
  );
}
