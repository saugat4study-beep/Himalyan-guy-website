"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white border border-pine/10 rounded p-8 text-center">
        <p className="font-display text-xl text-pine-deep mb-1">Message sent.</p>
        <p className="text-sm text-[#4B4A42]">Thanks for reaching out — I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input required value={form.name} onChange={update("name")} className="w-full border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input required type="email" value={form.email} onChange={update("email")} className="w-full border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Subject</label>
        <input value={form.subject} onChange={update("subject")} className="w-full border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Message</label>
        <textarea required rows={5} value={form.message} onChange={update("message")} className="w-full border border-[#D8D3C4] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-pine" />
      </div>
      <button type="submit" disabled={status === "loading"} className="bg-pine-deep text-white text-sm font-medium px-6 py-3 rounded hover:opacity-90 disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && <p className="text-flag text-sm">Something went wrong — please try again.</p>}
    </form>
  );
}
