"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// Types for our data
export interface NFT {
    id: string;
    title: string;
    creator: string;
    price: string;
    time_left: string;
    image_url: string;
    category_id: string;
    created_at: string;
    display_order: number;
}

export interface Category {
    id: string;
    name: string;
    created_at: string;
    display_order: number;
    nfts: NFT[];
}

export function useRealtimeNFTs(initialData: Category[]) {
    const [categories, setCategories] = useState<Category[]>(initialData);

    useEffect(() => {
        const supabase = createClient();

        // Subscribe to NFT changes
        const nftChannel = supabase
            .channel("nfts-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "nfts" },
                (payload: RealtimePostgresChangesPayload<NFT>) => {
                    setCategories((prev) => {
                        // Deep clone to avoid mutation
                        const updated = JSON.parse(JSON.stringify(prev)) as Category[];

                        if (payload.eventType === "INSERT") {
                            const newNFT = payload.new as NFT;
                            const categoryIndex = updated.findIndex(
                                (c) => c.id === newNFT.category_id
                            );
                            if (categoryIndex !== -1) {
                                updated[categoryIndex].nfts.push(newNFT);
                            }
                        } else if (payload.eventType === "UPDATE") {
                            const updatedNFT = payload.new as NFT;
                            for (const category of updated) {
                                const nftIndex = category.nfts.findIndex(
                                    (n) => n.id === updatedNFT.id
                                );
                                if (nftIndex !== -1) {
                                    // If category changed, remove from old and add to new
                                    if (category.id !== updatedNFT.category_id) {
                                        category.nfts.splice(nftIndex, 1);
                                        const newCategory = updated.find(
                                            (c) => c.id === updatedNFT.category_id
                                        );
                                        if (newCategory) {
                                            newCategory.nfts.push(updatedNFT);
                                        }
                                    } else {
                                        category.nfts[nftIndex] = updatedNFT;
                                    }
                                    break;
                                }
                            }
                        } else if (payload.eventType === "DELETE") {
                            const deletedNFT = payload.old as NFT;
                            for (const category of updated) {
                                const nftIndex = category.nfts.findIndex(
                                    (n) => n.id === deletedNFT.id
                                );
                                if (nftIndex !== -1) {
                                    category.nfts.splice(nftIndex, 1);
                                    break;
                                }
                            }
                        }

                        return updated;
                    });
                }
            )
            .subscribe();

        // Subscribe to Category changes
        const categoryChannel = supabase
            .channel("categories-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "categories" },
                (payload: RealtimePostgresChangesPayload<Category>) => {
                    setCategories((prev) => {
                        const updated = JSON.parse(JSON.stringify(prev)) as Category[];

                        if (payload.eventType === "INSERT") {
                            const newCategory = payload.new as Category;
                            updated.push({ ...newCategory, nfts: [] });
                        } else if (payload.eventType === "UPDATE") {
                            const updatedCategory = payload.new as Category;
                            const index = updated.findIndex(
                                (c) => c.id === updatedCategory.id
                            );
                            if (index !== -1) {
                                updated[index] = { ...updated[index], ...updatedCategory };
                            }
                        } else if (payload.eventType === "DELETE") {
                            const deletedCategory = payload.old as Category;
                            const index = updated.findIndex(
                                (c) => c.id === deletedCategory.id
                            );
                            if (index !== -1) {
                                updated.splice(index, 1);
                            }
                        }

                        return updated;
                    });
                }
            )
            .subscribe();

        // Cleanup subscriptions on unmount
        return () => {
            supabase.removeChannel(nftChannel);
            supabase.removeChannel(categoryChannel);
        };
    }, []);

    return categories;
}
