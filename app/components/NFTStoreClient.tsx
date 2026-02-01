"use client";

import { useState } from "react";
import NFTCard from "./NFTCard";
import VideoModal from "./VideoModal";
import { useRealtimeNFTs, Category } from "../hooks/useRealtimeNFTs";

interface NFTStoreClientProps {
    initialData: Category[];
    query: string;
}

export default function NFTStoreClient({
    initialData,
    query,
}: NFTStoreClientProps) {
    const categories = useRealtimeNFTs(initialData);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <p className="text-muted text-lg">No content currently available.</p>
                <a href="/login" className="text-accent hover:underline">
                    Admin Login
                </a>
            </div>
        );
    }

    return (
        <>
            {categories.map((category) => {
                // Filter NFTs based on search query and sort by display_order
                const filteredItems = category.nfts
                    ?.filter(
                        (item) =>
                            !query ||
                            item.title.toLowerCase().includes(query) ||
                            item.creator.toLowerCase().includes(query)
                    )
                    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

                if (!filteredItems || filteredItems.length === 0) return null;

                return (
                    <section key={category.id} className="space-y-3 sm:space-y-4">
                        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight px-1">
                            {category.name}
                        </h1>
                        <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 sm:pb-6 pt-1 sm:pt-2 snap-x snap-mandatory hide-scrollbar rounded-2xl sm:rounded-3xl -mx-1 px-1">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="min-w-[260px] sm:min-w-[300px] md:min-w-[340px] snap-start"
                                >
                                    <NFTCard
                                        id={item.id}
                                        image={item.image_url}
                                        creator={item.creator}
                                        title={item.title}
                                        price={item.price}
                                        timeLeft={item.time_left}
                                        onInstallationClick={(url) => setActiveVideo(url)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}

            <VideoModal
                videoUrl={activeVideo}
                onClose={() => setActiveVideo(null)}
            />
        </>
    );
}
