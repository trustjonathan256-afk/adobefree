"use server"

import { createClient } from "../utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitSupportRequest(formData: FormData) {
  const name = formData.get("name")?.toString()
  const email = formData.get("email")?.toString()
  const message = formData.get("message")?.toString()

  if (!name || !message) {
    return { error: "Name and message are required fields." }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("support_requests")
    .insert([{ name, email, message, status: "pending" }])

  if (error) {
    console.error("Error submitting support request:", error)
    return { error: "Failed to submit request. Please try again." }
  }

  // Optional: revalidate the admin path so they see it immediately if they are looking
  revalidatePath('/admin/support')

  return { success: true }
}
