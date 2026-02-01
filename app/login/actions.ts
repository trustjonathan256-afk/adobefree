"use server";
// Helper for admin login

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // 1. Get credentials
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 2. Enforce restricted access
  if (email !== "trustjonathan.ug@gmail.com") {
    // In a real app we might genericize the error, but for this specific request:
    return redirect("/login?error=Access Denied: Restricted Email");
  }

  // 3. Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Error:", error);
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // 4. Redirect on success
  revalidatePath("/", "layout");
  redirect("/admin");
}
