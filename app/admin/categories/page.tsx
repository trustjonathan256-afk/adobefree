import { createClient } from "../../utils/supabase/server";
import { addCategory } from "./actions";
import { Plus } from "lucide-react";
import DraggableCategoryList from "./DraggableCategoryList";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Categories</h2>
      </div>

      {/* Add Form */}
      <form
        action={addCategory}
        className="bg-card border border-card-border p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg"
      >
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted ml-2 block">
            New Category Name
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              name="name"
              required
              placeholder="e.g. Trending, Top Rated"
              className="flex-1 bg-white/5 border border-white/10 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-base sm:text-lg"
            />
            <button className="bg-white hover:bg-white/90 text-black font-bold py-3 px-6 sm:px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5 flex-shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Draggable Category List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between ml-2">
          <h3 className="text-lg font-semibold text-white">
            Existing Categories
          </h3>
          <span className="text-muted text-xs">Drag to reorder</span>
        </div>
        <DraggableCategoryList initialCategories={categories || []} />
      </div>
    </div>
  );
}
