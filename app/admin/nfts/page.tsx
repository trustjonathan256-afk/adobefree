import { createClient } from '../../utils/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DraggableAppsList from './DraggableAppsList'

export default async function NFTsPage() {
    const supabase = await createClient()

    // Fetch NFTs with Category name, ordered by display_order
    const { data: nfts } = await supabase
        .from('nfts')
        .select('*, categories(name)')
        .order('display_order', { ascending: true })

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Apps</h2>
                    <span className="text-muted text-xs">Drag to reorder</span>
                </div>
                <Link href="/admin/nfts/new" className="bg-white hover:bg-white/90 text-black font-bold h-[2.5rem] sm:h-[2.75rem] px-4 sm:px-6 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm sm:text-base">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    New App
                </Link>
            </div>

            {/* Draggable Apps List */}
            <DraggableAppsList initialNFTs={nfts || []} />
        </div>
    )
}
