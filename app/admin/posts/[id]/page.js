import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default async function EditPostPage({ params }) {
  const supabase = createClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", params.id).single();
  if (!post) notFound();
  return <PostEditor post={post} />;
}
