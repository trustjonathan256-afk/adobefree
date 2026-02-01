import { createClient } from "../../../utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import NewAppForm from "./NewAppForm";

export default async function NewNFTPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/nfts"
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h2 className="text-3xl font-bold text-white">Add New App</h2>
      </div>

      <NewAppForm categories={categories || []} />
    </div>
  );
}
