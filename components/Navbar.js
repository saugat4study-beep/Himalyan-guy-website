import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-ridge/90 backdrop-blur-md border-b border-pine/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
        <Link href="/" className="font-display font-semibold text-xl text-pine">
          The Himalayan <span className="text-clay">Guy</span>
        </Link>
        <div className="hidden md:flex gap-9 text-sm font-medium">
          <Link href="/" className="opacity-75 hover:opacity-100">Home</Link>
          <Link href="/about" className="opacity-75 hover:opacity-100">About</Link>
          <Link href="/blog" className="opacity-75 hover:opacity-100">Blog</Link>
          <Link href="/gallery" className="opacity-75 hover:opacity-100">Gallery</Link>
          <Link href="/contact" className="opacity-75 hover:opacity-100">Contact</Link>
        </div>
        <Link
          href="/blog"
          className="font-mono text-xs tracking-wide border border-pine text-pine px-4 py-2 rounded-sm hover:bg-pine hover:text-ridge transition-colors"
        >
          Read the Blog
        </Link>
      </div>
    </nav>
  );
}
