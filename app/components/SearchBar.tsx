"use client";

import { Search, X } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");

  const handleSearch = (newTerm: string) => {
    setTerm(newTerm);
    const params = new URLSearchParams(searchParams);
    if (newTerm) {
      params.set("q", newTerm);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full sm:max-w-xs group pr-0 sm:pr-[0.2rem]">
      {/* Input Field */}
      <input
        type="text"
        placeholder=" "
        className={`peer w-full bg-card border border-card-border rounded-full ${compact ? "py-[0.65rem] text-sm" : "py-[0.9rem] text-[0.95rem]"} pl-4 pr-10 text-white text-center placeholder-transparent focus:outline-none focus:border-accent/50 focus:border-accent/50 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-light`}
        value={term}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Clear Button (Visible when there is text) */}
      {term && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Centered Placeholder & Icon Group (Visible when input is empty/not focused) */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 pointer-events-none transition-opacity duration-200 ${term ? "opacity-0" : "peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0"}`}
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
