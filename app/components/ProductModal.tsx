"use client";

import { X, DollarSign, CloudDownload, Share2, Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getFileSize } from "./actions";
import { useState, useEffect } from "react";

interface ProductModalProps {
    product: {
        id: string;
        image: string;
        title: string;
        description?: string;
        product_image_url?: string;
        creator: string;
        price: string;
        timeLeft: string;
    } | null;
    onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (product) {
            setIsVisible(true);
            const liked = localStorage.getItem(`liked-${product.id}`);
            if (liked) {
                setIsLiked(JSON.parse(liked));
            } else {
                setIsLiked(false);
            }
        } else {
            setIsVisible(false);
        }
    }, [product]);

    if (!product) return null;

    const handleLike = () => {
        const newState = !isLiked;
        setIsLiked(newState);
        localStorage.setItem(`liked-${product.id}`, JSON.stringify(newState));
    };

    const handleShare = async () => {
        const shareData = {
            title: product.title,
            text: `Check out ${product.title} on Adobe Free`,
            url: window.location.href, // Or construct a specific product URL if routing existed
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
        if (!product.timeLeft) {
            toast.error("Download URL not set!");
            return;
        }

        const toastId = toast.loading("Checking file size...");

        try {
            const size = await getFileSize(product.id);
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

            setTimeout(() => {
                window.location.href = `/api/download/${product.id}`;
            }, 500);
        } catch (error) {
            console.error("Size check failed", error);
            toast.success("Download started", { id: toastId });
            window.location.href = `/api/download/${product.id}`;
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-300 ${isVisible ? "opacity-100 backdrop-blur-md bg-black/60" : "opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-[#0f1115] w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 transform ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button Mobile - Absolute */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white/70 hover:text-white backdrop-blur-md border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>


                {/* Image Section */}
                <div className="relative w-full md:w-5/12 aspect-video md:aspect-auto bg-[#0f1115] overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none">
                    <Image
                        src={product.product_image_url || product.image}
                        alt={product.title}
                        fill
                        className="object-cover scale-[1.02] rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    {/* Floating Action Buttons over Image */}
                    <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center transition-all hover:bg-accent hover:border-accent hover:scale-110 backdrop-blur-md cursor-pointer"
                        >
                            <Share2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                            onClick={handleLike}
                            className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center transition-all hover:bg-pink-500 hover:border-pink-500 hover:scale-110 backdrop-blur-md cursor-pointer"
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-white text-white" : "text-white"}`} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col relative bg-card/50 backdrop-blur-sm">
                    {/* Close Button Desktop */}
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="space-y-1 mb-6">
                        <span className="text-accent font-medium tracking-wide">
                            {product.creator}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            {product.title}
                        </h2>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-price" strokeWidth={2.5} />
                                <span className="text-price font-bold text-lg">
                                    {product.price}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8 min-h-[100px]">
                        <p className="text-muted text-lg leading-relaxed whitespace-pre-line">
                            {product.description || "No description available for this application."}
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleDownload}
                            className="w-full bg-white hover:bg-white/90 text-black font-bold py-4 rounded-full transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 text-lg group"
                        >
                            <CloudDownload className="w-5 h-5 group-hover:animate-bounce" />
                            Download Now
                        </button>
                        <p className="text-center text-muted/50 text-xs mt-3">
                            Secure download directly from server
                        </p>
                    </div>
                </div>

                {/* Border Overlay */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none z-50" />
            </div>
        </div>
    );
}
