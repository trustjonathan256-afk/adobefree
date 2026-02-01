import { createClient } from '../../../utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EditAppForm from './EditAppForm'

export default async function EditNFTPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch NFT
    const { data: nft } = await supabase.from('nfts').select('*').eq('id', id).single()
    if (!nft) notFound()

    // Fetch Categories
    const { data: categories } = await supabase.from('categories').select('*').order('name')

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/nfts" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <h2 className="text-3xl font-bold text-white">Edit App</h2>
            </div>

            <EditAppForm nft={nft} categories={categories || []} />
        </div>
    )
}
