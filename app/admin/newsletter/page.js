import { createClient } from "@/lib/supabaseServer";
import { format } from "date-fns";

export default async function AdminNewsletterPage() {
  const supabase = createClient();
  const { data: subs, count } = await supabase.from("subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-semibold text-2xl text-pine-deep">Newsletter Subscribers</h1>
        <span className="font-mono text-xs text-[#8a8776]">{count ?? 0} total</span>
      </div>
      <div className="bg-white border border-pine/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FBF9F4] border-b border-pine/10">
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Email</th>
              <th className="text-left font-mono text-[10.5px] uppercase text-[#8a8776] px-5 py-3.5">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subs?.map((s) => (
              <tr key={s.id} className="border-b border-pine/10 last:border-0">
                <td className="px-5 py-3.5">{s.email}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-[#6B6A60]">{format(new Date(s.created_at), "MMM d, yyyy")}</td>
              </tr>
            ))}
            {!subs?.length && <tr><td colSpan={2} className="px-5 py-8 text-center text-[#8a8776] text-sm">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
