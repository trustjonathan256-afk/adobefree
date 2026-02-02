
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Share2, Heart, CloudDownload, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { getFileSize } from "./actions";

interface NFTCardProps {
    id: string;
    image: string;
    creator: string;
    title: string;
    price: string;
    timeLeft: string;
    onInstallationClick: (url: string) => void;
}

export default function NFTCard({
    id,
    image,
    creator,
    title,
    price,
    timeLeft,
    onInstallationClick,
}: NFTCardProps) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const liked = localStorage.getItem(`liked-${id}`);
        if (liked) {
            setIsLiked(JSON.parse(liked));
        }
    }, [id]);

    const handleLike = () => {
        const newState = !isLiked;
        setIsLiked(newState);
        localStorage.setItem(`liked-${id}`, JSON.stringify(newState));
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Adobe Free',
            text: 'Check out Adobe Free App Store',
            url: 'https://adobefree.com',
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                toast.success("Link copied to clipboard!");
            } catch (err) {
                console.error("Error copying link:", err);
            }
        }
    };

    const handleDownload = async () => {
        if (!timeLeft) {
            toast.error("Download URL not set!");
            return;
        }

        const toastId = toast.loading("Checking file size...");

        try {
            // Use server action to get file size (avoids CORS issues)
            const size = await getFileSize(id);

            let sizeText = "";

            if (size) {
                const gigabytes = size / (1024 * 1024 * 1024);
                if (gigabytes >= 1) {
                    sizeText = `(${gigabytes.toFixed(2)} GB)`;
                } else {
                    const megabytes = size / (1024 * 1024);
                    sizeText = `(${megabytes.toFixed(0)} MB)`;
                }
            }

            toast.success(`Download started ${sizeText}`, { id: toastId });

            // Short delay to let the toast appear before the browser handles the download
            setTimeout(() => {
                window.location.href = `/api/download/${id}`;
            }, 500);

        } catch (error) {
            console.error("Size check failed", error);
            toast.success("Download started", { id: toastId });
            window.location.href = `/api/download/${id}`;
        }
    };

    return (
        <div className="cursor-pointer bg-card rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-card-border flex flex-col group transition-all duration-500 ease-out hover:!border-white/15 hover:shadow-2xl hover:shadow-accent/5">
            {/* Image Section */}
            <div className="relative p-1.5 sm:p-2 pb-0">
                <div className="relative aspect-[5/3] rounded-t-[1.3rem] sm:rounded-t-[1.8rem] lg:rounded-t-[2.3rem] rounded-b-[1rem] sm:rounded-b-[1.25rem] lg:rounded-b-[1.5rem] overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Action Buttons (Overlapping Image) */}
                <div className="absolute bottom-0 right-4 sm:right-6 flex items-center gap-1.5 sm:gap-2 z-10 translate-y-1/2">
                    <button
                        onClick={handleShare}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#1c1e26] border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-accent hover:border-accent shadow-xl cursor-pointer group/btn"
                    >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-white/70 group-hover/btn:text-white transition-colors" />
                    </button>
                    <button
                        onClick={handleLike}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#1c1e26] border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-pink-500 hover:border-pink-500 shadow-xl cursor-pointer group/btn"
                    >
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${isLiked ? "text-white fill-white" : "text-white/70 group-hover/btn:text-white"}`} />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="px-4 sm:px-5 lg:px-7 pt-4 sm:pt-5 pb-4 sm:pb-5 space-y-3 sm:space-y-4">
                <div className="space-y-0.5 px-0.5 sm:px-1">
                    <span className="text-muted text-xs sm:text-sm font-medium tracking-wide">
                        {creator}
                    </span>
                    <div className="flex items-center justify-between">
                        <h3 className="text-[1rem] sm:text-[1.15rem] font-bold tracking-tight text-white leading-snug whitespace-nowrap">
                            {title}
                        </h3>
                        <div className="flex items-center gap-0.5 mt-0.5">
                            {/* Dollar Icon */}
                            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-price" strokeWidth={2.5} />
                            <span className="text-price font-bold text-base sm:text-lg">
                                {price}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 pt-1 sm:pt-2">
                    <button
                        onClick={() => onInstallationClick("/installation-video/MONTAGEM BOLADA (Ultra Slowed).mp4")}
                        className="pill-container rounded-full px-2 py-2 sm:py-2.5 flex items-center justify-center flex-1 min-w-0 cursor-pointer border border-card-border hover:!border-white/15 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 ease-out active:scale-95 group/inst"
                    >
                        <span className="text-muted/80 font-semibold text-[0.7rem] sm:text-[0.8rem] whitespace-nowrap truncate transition-colors">
                            Installation
                        </span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 min-w-0 bg-white hover:bg-white/90 text-black font-bold py-2 sm:py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-white/20 text-[0.8rem] sm:text-[0.9rem] cursor-pointer flex items-center justify-center px-2 hover:scale-[1.02] active:scale-95 group/download"
                    >
                        <CloudDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0 group-hover/download:animate-bounce" />
                        <span className="truncate">Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
