'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { updateNFT } from '../actions'

interface Category {
    id: string
    name: string
}

interface NFT {
    id: string
    title: string
    creator: string
    price: string
    time_left: string | null
    category_id: string | null
    image_url: string
}

interface EditAppFormProps {
    nft: NFT
    categories: Category[]
}

export default function EditAppForm({ nft, categories }: EditAppFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(nft.image_url || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const clearPreview = () => {
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <form action={updateNFT} className="bg-card border border-card-border p-8 rounded-[2rem] space-y-6 shadow-xl">
            <input type="hidden" name="id" value={nft.id} />
            <input type="hidden" name="current_image_url" value={nft.image_url} />

            {/* Image Upload */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-muted ml-2 block">App Icon / Image</label>

                <input
                    ref={fileInputRef}
                    type="file"
                    name="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                {previewUrl ? (
                    <div className="relative w-full h-64 rounded-[2rem] overflow-hidden group border-2 border-dashed border-white/10 bg-white/5">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={clearPreview}
                                className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="p-3 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer backdrop-blur-md"
                            >
                                <Upload className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={triggerFileInput}
                        className="relative border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center hover:border-accent/50 transition-colors group cursor-pointer bg-white/5 select-none"
                    >
                        <div className="flex flex-col items-center gap-4 pointer-events-none">
                            <div className="p-4 bg-white/10 rounded-full group-hover:bg-accent/20 transition-colors">
                                <Upload className="w-8 h-8 text-muted group-hover:text-accent" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-medium">Click to upload New App Icon</p>
                                <p className="text-muted text-sm">SVG, PNG, JPG or GIF (max. 10MB)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted ml-2 block">Title</label>
                    <input name="title" defaultValue={nft.title} required className="w-full bg-white/5 border border-white/10 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-all text-base sm:text-lg" />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted ml-2 block">Creator</label>
                    <input name="creator" defaultValue={nft.creator} required className="w-full bg-white/5 border border-white/10 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-all text-base sm:text-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted ml-2 block">Price</label>
                    <input name="price" defaultValue={nft.price} required className="w-full bg-white/5 border border-white/10 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-all text-base sm:text-lg" />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted ml-2 block">Download URL</label>
                    <input name="time_left" defaultValue={nft.time_left || ''} placeholder="e.g. https://mega.nz/..." className="w-full bg-white/5 border border-white/10 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-all text-base sm:text-lg" />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium text-muted ml-2 block">Category</label>
                <div className="relative">
                    <select name="category_id" defaultValue={nft.category_id || ''} required className="w-full bg-[#1c1e26] border border-white/10 rounded-full py-4 px-8 text-white focus:outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer text-lg">
                        <option value="" disabled>Select a category</option>
                        {categories?.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button className="w-full bg-white hover:bg-white/90 text-black font-bold py-3.5 rounded-full transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                    Update App
                </button>
            </div>
        </form>
    )
}
