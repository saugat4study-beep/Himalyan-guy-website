"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#22453a,#0F211B_70%)] px-6">
      <form onSubmit={handleLogin} className="bg-ridge w-full max-w-sm p-10 rounded shadow-2xl">
        <div className="font-display font-semibold text-xl text-pine mb-1">The Himalayan <span className="text-clay">Guy</span></div>
        <div className="font-mono text-[11px] tracking-widest uppercase text-[#8a8776] mb-7">Admin Dashboard</div>

        <label className="block text-xs font-medium mb-1.5">Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 border border-[#D8D3C4] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-pine" />

        <label className="block text-xs font-medium mb-1.5">Password</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 border border-[#D8D3C4] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-pine" />

        <button type="submit" disabled={loading} className="w-full bg-pine-deep text-white text-sm font-medium py-3 rounded hover:opacity-90 disabled:opacity-60">
          {loading ? "Signing in..." : "Log in"}
        </button>

        {error && <p className="text-flag text-xs mt-4 text-center">{error}</p>}
        <p className="font-mono text-[10.5px] text-[#8a8776] text-center mt-5">
          Only your Supabase admin account can log in here.
        </p>
      </form>
    </div>
  );
}
