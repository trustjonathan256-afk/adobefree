import SearchBar from "./components/SearchBar";
import NFTStoreClient from "./components/NFTStoreClient";
import { Headset } from "lucide-react";
import Image from "next/image";
import { createClient } from "./utils/supabase/server";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query =
    typeof searchParams.q === "string" ? searchParams.q.toLowerCase() : "";

  const supabase = await createClient();

  // Fetch Categories with their NFTs, ordered by category creation
  const { data: categoriesWithNFTs } = await supabase
    .from("categories")
    .select("*, nfts(*)")
    .order("display_order", { ascending: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div
          className="w-full mx-auto flex items-center justify-between gap-3 sm:gap-6 lg:gap-8"
          style={{ maxWidth: "calc(80rem + 2rem)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo-new.png"
              alt="Free"
              width={120}
              height={40}
              className="object-contain h-8 sm:h-10 w-auto"
              priority
            />
          </div>

          {/* Search Bar - Hidden on very small screens */}
          <div className="hidden sm:flex flex-1 justify-center">
            <SearchBar />
          </div>

          {/* Support Button */}
          <button className="flex items-center gap-2 bg-white hover:bg-white/90 border border-transparent rounded-full px-3 sm:px-5 py-2 sm:py-[0.68rem] text-black font-medium transition-colors cursor-pointer flex-shrink-0 text-sm sm:text-base">
            <Headset className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:block">Support</span>
          </button>
        </div>

        {/* Mobile Search Bar - Below header on small screens */}
        <div className="sm:hidden mt-3">
          <SearchBar compact={true} />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <NFTStoreClient
            initialData={categoriesWithNFTs || []}
            query={query}
          />
        </div>
      </main>
    </div>
  );
}

