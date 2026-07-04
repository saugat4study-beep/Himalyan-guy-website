import { createClient } from "@/lib/supabaseServer";

export const revalidate = 60;
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: images } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <p className="font-mono text-xs tracking-widest uppercase text-clay mb-2">Gallery</p>
      <h1 className="font-display font-semibold text-4xl md:text-5xl text-pine-deep mb-12">Nepal in Frames</h1>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-sm overflow-hidden group">
              <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              {img.category && (
                <span className="absolute bottom-2 left-2 font-mono text-[10px] text-white uppercase tracking-wide">{img.category}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#8a8776] text-sm">No photos uploaded yet — add some from the admin dashboard.</p>
      )}
    </div>
  );
}
