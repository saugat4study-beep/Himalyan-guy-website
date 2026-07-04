import { createClient } from "@/lib/supabaseServer";
import { format } from "date-fns";

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-pine-deep mb-8">Contact Messages</h1>
      <div className="bg-white border border-pine/10 rounded divide-y divide-pine/10">
        {messages?.map((m) => (
          <div key={m.id} className="p-5">
            <div className="font-mono text-[11px] text-[#8a8776] mb-1.5">
              {m.name} · {m.email} · {m.subject || "No subject"} · {format(new Date(m.created_at), "MMM d, yyyy")}
            </div>
            <p className="text-sm text-[#333]">{m.message}</p>
            <a href={`mailto:${m.email}`} className="font-mono text-[11px] text-glacier mt-2 inline-block">Reply by email</a>
          </div>
        ))}
        {!messages?.length && <p className="p-8 text-center text-sm text-[#8a8776]">No messages yet.</p>}
      </div>
    </div>
  );
}
