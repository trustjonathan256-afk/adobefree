"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NFTCard from "./NFTCard";
import VideoModal from "./VideoModal";
import ProductModal from "./ProductModal";
import { useRealtimeNFTs, Category, NFT } from "../hooks/useRealtimeNFTs";

// Custom hook for drag and wheel scrolling
function useDragScroll() {
  // We use a callback ref to ensure we capture the node even if it renders late
  const internalRef = useRef<HTMLDivElement | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const ref = useCallback((element: HTMLDivElement | null) => {
    internalRef.current = element;
    setNode(element);
  }, []);

  // Add non-passive wheel listener to map vertical scroll to horizontal
  useEffect(() => {
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      // Check if purely vertical scroll (most mice)
      if (e.deltaY !== 0) {
        // Prevent page scrolling
        e.preventDefault();
        // Scroll the element horizontally with smooth behavior
        node.scrollBy({
          left: e.deltaY,
          behavior: "smooth",
        });
      }
    };

    // Passive: false is strict requirement to allow e.preventDefault()
    node.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", onWheel);
    };
  }, [node]);

  const [isDragging, setIsDragging] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [startX, setStartX] = useState(0);

  // Use refs to track mouse state without triggering re-renders until threshold is met
  const isMouseDown = useRef(false);
  const mouseDownX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!internalRef.current) return;
    isMouseDown.current = true;
    mouseDownX.current = e.pageX;
    setStartX(e.pageX - internalRef.current.offsetLeft);
    setScrollLeft(internalRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    isMouseDown.current = false;
    setIsDragging(false);
  };

  const onMouseUp = () => {
    isMouseDown.current = false;
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !internalRef.current) return;

    // Only start dragging if moves more than 5 pixels
    const x = e.pageX;
    const distance = Math.abs(x - mouseDownX.current);

    if (!isDragging && distance > 5) {
      setIsDragging(true);
    }

    if (isDragging) {
      e.preventDefault();
      const walkX = (x - (startX + internalRef.current.offsetLeft)) * 2; // Drag multiplier
      internalRef.current.scrollLeft = scrollLeft - walkX;
    }
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging };
}

function CategorySection({
  category,
  query,
}: {
  category: Category;
  query: string;
}) {
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging } =
    useDragScroll();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<NFT | null>(null);

  // Filter NFTs based on search query and sort by display_order
  const filteredItems = category.nfts
    ?.filter(
      (item) =>
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query),
    )
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  if (!filteredItems || filteredItems.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-4">
      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight px-1">
        {category.name}
      </h1>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className={`flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 sm:pb-6 pt-1 sm:pt-2 snap-x snap-proximity hide-scrollbar rounded-2xl sm:rounded-3xl -mx-1 px-1 ${isDragging ? "snap-none" : ""}`}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[16.25rem] sm:min-w-[18.75rem] md:min-w-[21.25rem] snap-start pointer-events-auto"
          >
            {/* Disable clicking card while dragging to prevent accidental opens */}
            <div className={`${isDragging ? "pointer-events-none" : ""}`}>
              <NFTCard
                id={item.id}
                image={item.image_url}
                creator={item.creator}
                title={item.title}
                price={item.price}
                timeLeft={item.time_left}
                description={item.description}
                downloads={item.downloads}
                onInstallationClick={(url) => setActiveVideo(url)}
                onDetailsClick={() => setActiveProduct(item)}
              />
            </div>
          </div>
        ))}
      </div>

      <VideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />

      <ProductModal
        product={
          activeProduct && (category.nfts.find(n => n.id === activeProduct.id) || activeProduct) && {
            id: activeProduct.id,
            image: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).image_url,
            title: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).title,
            description: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).description,
            product_image_url: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).product_image_url,
            creator: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).creator,
            price: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).price,
            timeLeft: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).time_left,
            downloads: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).downloads,
            badge_text: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).badge_text,
          }
        }
        onClose={() => setActiveProduct(null)}
      />
    </section>
  );
}

interface NFTStoreClientProps {
  initialData: Category[];
  query: string;
}

export default function NFTStoreClient({
  initialData,
  query,
}: NFTStoreClientProps) {
  const categories = useRealtimeNFTs(initialData);

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
      {categories.map((category) => (
        <CategorySection key={category.id} category={category} query={query} />
      ))}
    </>
  );
}
