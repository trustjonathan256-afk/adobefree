"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, AppWindow, Menu, X, LogOut } from "lucide-react";

interface MobileSidebarProps {
    signOutAction: () => Promise<void>;
}

export function MobileSidebar({ signOutAction }: MobileSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(path);
    };

    const links = [
        {
            href: "/admin",
            label: "Overview",
            icon: LayoutDashboard,
            active: isActive("/admin"),
        },
        {
            href: "/admin/categories",
            label: "Categories",
            icon: Layers,
            active: isActive("/admin/categories"),
        },
        {
            href: "/admin/nfts",
            label: "Apps",
            icon: AppWindow,
            active: isActive("/admin/nfts"),
        },
    ];

    return (
        <>
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-card border border-card-border rounded-full shadow-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="w-5 h-5 text-white" />
                ) : (
                    <Menu className="w-5 h-5 text-white" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-card border-r border-card-border flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 border-b border-white/5 pt-16">
                    <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 group relative overflow-hidden ${link.active
                                ? "bg-white text-black font-bold shadow-lg shadow-white/10"
                                : "text-muted hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="relative z-10 flex items-center gap-3">
                                <link.icon
                                    className={`w-5 h-5 ${link.active ? "text-black" : "group-hover:text-white transition-colors"}`}
                                />
                                <span className="font-medium">{link.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <form action={signOutAction}>
                        <button className="w-full flex items-center gap-3 px-6 py-3 rounded-full text-red-400 hover:bg-red-400/10 transition-colors pointer-events-auto cursor-pointer">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
