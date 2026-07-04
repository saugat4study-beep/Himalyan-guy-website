"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const NAV = [
  { group: "Content" },
  { href: "/admin", label: "📊 Dashboard" },
  { href: "/admin/posts", label: "📝 Posts" },
  { href: "/admin/posts/new", label: "➕ New Post" },
  { group: "Engagement" },
  { href: "/admin/comments", label: "💬 Comments" },
  { href: "/admin/newsletter", label: "✉️ Newsletter" },
  { href: "/admin/messages", label: "📩 Messages" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return children;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "220px 1fr" }}>
      <aside className="bg-[#0F211B] text-[#B7C6BE] p-4 flex flex-col">
        <div className="font-display font-semibold text-[17px] text-white px-2 pt-2 pb-6">
          Himalayan <span className="text-clay">Guy</span>
        </div>
        <nav className="flex-1">
          {NAV.map((item, i) =>
            item.group ? (
              <div key={i} className="font-mono text-[10px] tracking-widest uppercase text-[#5f7168] mt-4 mb-2 px-3">{item.group}</div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2.5 rounded text-[13.5px] mb-0.5 ${pathname === item.href ? "bg-pine text-white" : "hover:bg-white/5"}`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="pt-4 mt-4 border-t border-white/10">
          <Link href="/" className="block text-xs text-[#B7C6BE] mb-3">↗ View site</Link>
          <button onClick={handleLogout} className="text-xs text-flag">Log out</button>
        </div>
      </aside>
      <main className="p-10 overflow-y-auto bg-ridge">{children}</main>
    </div>
  );
}
