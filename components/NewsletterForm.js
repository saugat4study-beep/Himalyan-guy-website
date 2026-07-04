"use client";
import { useState } from "react";

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className={compact ? "text-sm text-[#E4C79A]" : "text-white"}>You're subscribed — thank you!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 min-w-0 px-3 py-2.5 text-sm text-ink rounded-l-sm border-none focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-xs bg-clay text-white px-4 rounded-r-sm hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && <p className="text-flag text-xs mt-2 w-full">Something went wrong — try again.</p>}
    </form>
  );
}
