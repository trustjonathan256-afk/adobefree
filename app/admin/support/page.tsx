import { createClient } from "../../utils/supabase/server"
import SupportRequestCard, { type SupportRequest } from "./SupportRequestCard"

export default async function SupportRequestsPage() {
  const supabase = await createClient()

  const { data: requests, error } = await supabase
    .from("support_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading support requests: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Support Requests</h2>
        <p className="text-muted text-sm sm:text-base">View and manage messages sent from the Support page.</p>
      </div>

      {(!requests || requests.length === 0) ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-muted">
          No support requests found yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req: SupportRequest) => (
            <SupportRequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  )
}
