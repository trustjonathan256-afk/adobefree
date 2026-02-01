"use server";
import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  // Simple slug generator
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const supabase = await createClient();

  // Get the max display_order to add new category at the end
  const { data: maxOrderData } = await supabase
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = (maxOrderData?.[0]?.display_order ?? -1) + 1;

  await supabase.from("categories").insert({ name, slug, display_order: nextOrder });
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/admin"); /* revalidate dashboard stats */
}

export async function updateCategoryOrder(
  categories: { id: string; display_order: number }[]
) {
  const supabase = await createClient();

  // Update each category's display_order
  for (const cat of categories) {
    await supabase
      .from("categories")
      .update({ display_order: cat.display_order })
      .eq("id", cat.id);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/"); // Revalidate homepage too
}
