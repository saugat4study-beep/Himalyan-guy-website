"use client";
import { useState } from "react";
import { format } from "date-fns";

export default function CommentSection({ postId, postTitle, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, postTitle, ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", content: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-pine/10">
      <h3 className="font-display text-2xl font-medium text-pine-deep mb-8">
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h3>

      <div className="space-y-6 mb-10">
        {comments.map((c) => (
          <div key={c.id} className="border-b border-pine/10 pb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-sm">{c.name}</span>
              <span className="font-mono text-[11px] text-[#8a8776]">{format(new Date(c.created_at), "MMM d, yyyy")}</span>
            </div>
            <p className="text-sm text-[#333]">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-[#8a8776]">Be the first to comment.</p>}
      </div>

      {status === "done" ? (
        <p className="text-sm bg-[#DEEAE2] text-pine px-4 py-3 rounded">
          Thanks — your comment is awaiting approval and will appear shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-pine/10 rounded p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
            <input required type="email" placeholder="Email (not published)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
          </div>
          <textarea required rows={4} placeholder="Write a comment..." value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
          <button type="submit" disabled={status === "loading"} className="bg-pine-deep text-white text-sm font-medium px-5 py-2.5 rounded hover:opacity-90 disabled:opacity-60">
            {status === "loading" ? "Posting..." : "Post Comment"}
          </button>
          {status === "error" && <p className="text-flag text-sm">Something went wrong — please try again.</p>}
        </form>
      )}
    </div>
  );
}
