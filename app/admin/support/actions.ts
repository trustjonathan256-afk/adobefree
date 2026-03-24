"use server"

import { createClient } from "../../utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteSupportRequest(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("support_requests")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting support request:", error)
    return { error: "Failed to delete request." }
  }

  revalidatePath('/admin/support')
  return { success: true }
}
