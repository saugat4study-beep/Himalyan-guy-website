export const metadata = { title: "About Me" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-20">
      <p className="font-mono text-xs tracking-widest uppercase text-clay mb-3">About</p>
      <h1 className="font-display font-semibold text-4xl md:text-5xl text-pine-deep mb-10">My Story</h1>

      <div className="w-full aspect-[3/2] rounded-sm bg-gradient-to-br from-glacier to-pine mb-10" />

      <div className="prose-himalaya text-[15.5px] space-y-5">
        <p>I'm the person behind The Himalayan Guy — a trekking journal built one trail, one teahouse, and one very long climb at a time.</p>
        <p>Edit this page from the admin dashboard to tell your own story: why you started trekking Nepal, what keeps you coming back, and what you hope readers take from these posts.</p>
        <h2>Why I Travel Nepal</h2>
        <p>Replace this section with your own motivation — the mountains, the people, the culture, or all three.</p>
        <h2>My Mission</h2>
        <p>Describe what you want this blog to do for readers planning their own trips.</p>
      </div>

      <div className="flex gap-3 mt-10 font-mono text-xs">
        {["Facebook", "Instagram", "YouTube", "TikTok", "X"].map((s) => (
          <a key={s} href="#" className="border border-pine/20 rounded px-3 py-2 text-pine">{s}</a>
        ))}
      </div>
    </div>
  );
}
