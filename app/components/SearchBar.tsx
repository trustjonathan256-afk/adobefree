"use client";

import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full sm:max-w-xs group pr-0 sm:pr-[0.2rem]">
      {/* Input Field */}
      <input
        type="text"
        placeholder=" "
        className={`peer w-full bg-card border border-card-border rounded-full ${compact ? "py-[0.65rem] text-sm" : "py-[0.9rem] text-[0.95rem]"} px-4 text-white text-center placeholder-transparent focus:outline-none focus:border-accent/50 focus:border-accent/50 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-light`}
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Centered Placeholder & Icon Group (Visible when input is empty/not focused) */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 pointer-events-none transition-opacity duration-200 ${searchParams.get("q") ? "opacity-0" : "peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0"}`}
      >
        <Search className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-muted`} />
        <span
          className={`text-muted ${compact ? "text-sm" : "text-[0.95rem]"} font-light`}
        >
          Search apps or brands
        </span>
      </div>
    </div>
  );
}
