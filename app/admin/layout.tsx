import { LogOut } from "lucide-react";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "./components/AdminNav";
import { MobileSidebar } from "./components/MobileSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'trustjonathan.ug@gmail.com') {
        redirect('/login');
    }

    const signOut = async () => {
        "use server";
        const sb = await createClient();
        await sb.auth.signOut();
        redirect('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar (client component with state) */}
            <MobileSidebar signOutAction={signOut} />

            {/* Desktop Sidebar - Hidden on mobile */}
            <aside className="hidden lg:flex w-64 bg-card border-r border-card-border flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
                </div>

                <AdminNav />

                <div className="p-4 border-t border-white/5 mt-auto">
                    <form action={signOut}>
                        <button className="w-full flex items-center gap-3 px-6 py-3 rounded-full text-red-400 hover:bg-red-400/10 transition-colors pointer-events-auto cursor-pointer">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}


