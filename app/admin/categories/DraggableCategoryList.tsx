"use client";

import { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { deleteCategory, updateCategoryOrder } from "./actions";

interface Category {
    id: string;
    name: string;
    slug: string;
    display_order: number;
}

interface DraggableCategoryListProps {
    initialCategories: Category[];
}

export default function DraggableCategoryList({
    initialCategories,
}: DraggableCategoryListProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
        // Add a slight delay to allow the drag image to be captured
        setTimeout(() => {
            const element = document.getElementById(`category-${id}`);
            if (element) element.style.opacity = "0.5";
        }, 0);
    };

    const handleDragEnd = async (e: React.DragEvent) => {
        const element = document.getElementById(`category-${draggedId}`);
        if (element) element.style.opacity = "1";

        if (draggedId && dragOverId && draggedId !== dragOverId) {
            const draggedIndex = categories.findIndex((c) => c.id === draggedId);
            const targetIndex = categories.findIndex((c) => c.id === dragOverId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newCategories = [...categories];
                const [removed] = newCategories.splice(draggedIndex, 1);
                newCategories.splice(targetIndex, 0, removed);

                // Update display_order for all items
                const updatedCategories = newCategories.map((cat, index) => ({
                    ...cat,
                    display_order: index,
                }));

                setCategories(updatedCategories);

                // Save to server
                await updateCategoryOrder(
                    updatedCategories.map((c) => ({ id: c.id, display_order: c.display_order }))
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
        setCategories(categories.filter((c) => c.id !== id));
        await deleteCategory(id);
    };

    if (!categories || categories.length === 0) {
        return (
            <p className="text-muted p-8 border border-white/5 rounded-[2rem] border-dashed text-center">
                No categories yet.
            </p>
        );
    }

    return (
        <div className="grid gap-3">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    id={`category-${cat.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, cat.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, cat.id)}
                    onDragLeave={handleDragLeave}
                    className={`bg-card border p-4 px-6 rounded-[1.5rem] flex justify-between items-center group transition-all duration-200 cursor-grab active:cursor-grabbing ${dragOverId === cat.id
                        ? "border-accent/50 bg-accent/5 scale-[1.02]"
                        : "border-card-border hover:border-white/20"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <GripVertical className="w-5 h-5 text-muted/50 group-hover:text-muted transition-colors" />
                        <div className="flex flex-col">
                            <span className="text-white font-medium text-lg">{cat.name}</span>
                            <span className="text-muted text-xs font-mono">{cat.slug}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-400 hover:bg-red-400/10 p-2.5 rounded-full transition-colors cursor-pointer group-hover:bg-white/5"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
