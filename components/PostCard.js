import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default function PostCard({ post, featured = false }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className={`relative overflow-hidden rounded-sm mb-4 bg-gradient-to-br from-glacier to-pine ${featured ? "aspect-[4/5]" : "aspect-[16/11]"}`}>
        {post.featured_image && (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {post.categories?.name && (
          <span className="absolute top-4 left-4 font-mono text-[11px] text-white bg-pine-deep/60 backdrop-blur px-2.5 py-1 rounded-sm">
            {post.categories.name}
          </span>
        )}
      </div>
      <h3 className={`font-display font-medium text-pine-deep leading-snug mb-2 ${featured ? "text-2xl" : "text-xl"}`}>
        {post.title}
      </h3>
      {post.excerpt && <p className="text-sm text-[#4B4A42]/85 mb-3">{post.excerpt}</p>}
      <div className="font-mono text-[11.5px] text-[#6B6A60] flex gap-3.5 mt-auto">
        <span>{post.reading_time || 5} MIN READ</span>
        {post.published_at && <span>{format(new Date(post.published_at), "MMM d, yyyy").toUpperCase()}</span>}
      </div>
    </Link>
  );
}
