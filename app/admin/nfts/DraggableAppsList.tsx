"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { deleteNFT, updateNFTOrder } from "./actions";

interface NFT {
    id: string;
    title: string;
    creator: string;
    price: string;
    image_url: string;
    display_order: number;
    category_id: string;
    categories?: { name: string };
}

interface DraggableAppsListProps {
    initialNFTs: NFT[];
}

export default function DraggableAppsList({
    initialNFTs,
}: DraggableAppsListProps) {
    const [nfts, setNfts] = useState(initialNFTs);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            const element = document.getElementById(`nft-${id}`);
            if (element) element.style.opacity = "0.5";
        }, 0);
    };

    const handleDragEnd = async () => {
        const element = document.getElementById(`nft-${draggedId}`);
        if (element) element.style.opacity = "1";

        if (draggedId && dragOverId && draggedId !== dragOverId) {
            const draggedIndex = nfts.findIndex((n) => n.id === draggedId);
            const targetIndex = nfts.findIndex((n) => n.id === dragOverId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newNfts = [...nfts];
                const [removed] = newNfts.splice(draggedIndex, 1);
                newNfts.splice(targetIndex, 0, removed);

                // Update display_order for all items
                const updatedNfts = newNfts.map((nft, index) => ({
                    ...nft,
                    display_order: index,
                }));

                setNfts(updatedNfts);

                // Save to server
                await updateNFTOrder(
                    updatedNfts.map((n) => ({ id: n.id, display_order: n.display_order }))
                );
            }
        }

        setDraggedId(null);
        setDragOverId(null);
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (id !== draggedId) {
            setDragOverId(id);
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDelete = async (id: string) => {
        setNfts(nfts.filter((n) => n.id !== id));
        await deleteNFT(id);
    };

    if (!nfts || nfts.length === 0) {
        return (
            <div className="text-center py-12 bg-card border border-card-border rounded-[2rem] border-dashed">
                <p className="text-muted">No Apps found. Create one to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
                <div
                    key={nft.id}
                    id={`nft-${nft.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, nft.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, nft.id)}
                    onDragLeave={handleDragLeave}
                    className={`bg-card border p-4 rounded-[2rem] flex gap-4 items-start group transition-all duration-200 cursor-grab active:cursor-grabbing ${dragOverId === nft.id
                        ? "border-accent/50 bg-accent/5 scale-[1.02]"
                        : "border-card-border hover:border-white/20"
                        }`}
                >
                    {/* Image Thumbnail */}
                    <div className="relative w-24 h-24 rounded-[1.2rem] overflow-hidden flex-shrink-0 bg-white/5">
                        <Image
                            src={nft.image_url}
                            alt={nft.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0 py-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-white font-bold truncate pr-2">{nft.title}</h3>
                            <div className="flex gap-1">
                                <Link
                                    href={`/admin/nfts/${nft.id}`}
                                    className="p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(nft.id)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-muted text-sm truncate">{nft.creator}</p>
                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-muted border border-white/5">
                                {nft.categories?.name || "Uncategorized"}
                            </span>
                            <span className="text-xs text-price font-medium">{nft.price}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
