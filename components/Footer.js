import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-pine-deep text-[#B7C6BE] mt-24">
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-10 pb-14">
          <div>
            <div className="font-display font-semibold text-xl text-white mb-3">
              The Himalayan <span className="text-clay">Guy</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-4">
              A personal travel blog documenting treks, villages, and everyday life across the Nepal Himalaya.
            </p>
            <NewsletterForm compact />
          </div>
          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#E4C79A] mb-4">Quick Links</h5>
            <Link href="/" className="block text-sm mb-2 opacity-85 hover:opacity-100">Home</Link>
            <Link href="/about" className="block text-sm mb-2 opacity-85 hover:opacity-100">About Me</Link>
            <Link href="/blog" className="block text-sm mb-2 opacity-85 hover:opacity-100">Blog</Link>
            <Link href="/gallery" className="block text-sm mb-2 opacity-85 hover:opacity-100">Gallery</Link>
            <Link href="/contact" className="block text-sm mb-2 opacity-85 hover:opacity-100">Contact</Link>
          </div>
          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#E4C79A] mb-4">Categories</h5>
            <Link href="/blog?category=trekking" className="block text-sm mb-2 opacity-85 hover:opacity-100">Trekking</Link>
            <Link href="/blog?category=culture" className="block text-sm mb-2 opacity-85 hover:opacity-100">Culture</Link>
            <Link href="/blog?category=villages" className="block text-sm mb-2 opacity-85 hover:opacity-100">Villages</Link>
            <Link href="/blog?category=wildlife" className="block text-sm mb-2 opacity-85 hover:opacity-100">Wildlife</Link>
          </div>
          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#E4C79A] mb-4">Follow</h5>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "YouTube", "TikTok", "X"].map((s) => (
                <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-xs">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between gap-2 font-mono text-[11.5px] text-[#8CA096]">
          <span>© 2026 The Himalayan Guy. All Rights Reserved.</span>
          <Link href="/admin" className="underline">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
