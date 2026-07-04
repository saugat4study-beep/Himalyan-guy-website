import { createClient } from "@/lib/supabaseServer";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = createClient();
  const { data: posts } = await supabase.from("posts").select("slug, updated_at").eq("status", "published");

  const staticRoutes = ["", "/about", "/blog", "/gallery", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const postRoutes = (posts || []).map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...postRoutes];
}
