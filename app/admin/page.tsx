import { createClient } from "../utils/supabase/server";

export default async function AdminDashboard() {
  // Keeping original function name as AdminDashboard
  const supabase = await createClient();

  // Fetch counts
  const { count: nftsCount } = await supabase
    .from("nfts")
    .select("*", { count: "exact", head: true });
  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });
  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true }); // Assuming you might have a users table or just use static for now if auth is handled differently

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Stat Card 1 */}
        <div className="bg-card border border-card-border p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] space-y-2">
          <h3 className="text-muted font-medium text-sm">Total Apps</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {nftsCount || 0}
          </p>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-card border border-card-border p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] space-y-2">
          <h3 className="text-muted font-medium text-sm">Categories</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {categoriesCount || 0}
          </p>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-card border border-card-border p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] space-y-2">
          <h3 className="text-muted font-medium text-sm">Total Users</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {usersCount || 0}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-card border border-card-border rounded-[1.5rem] sm:rounded-[2rem] text-center space-y-2">
        <p className="text-white text-base sm:text-lg">
          Select a section from the sidebar to manage content.
        </p>
        <p className="text-muted text-xs sm:text-sm">
          You can add, edit, or delete Categories and Apps.
        </p>
      </div>
    </div>
  );
}
