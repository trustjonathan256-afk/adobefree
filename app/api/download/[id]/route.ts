import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Create a simple Supabase client (no auth needed for public reads)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing app ID' }, { status: 400 })
    }

    // Fetch the NFT/app by ID to get the actual download URL
    const { data: nft, error } = await supabase
        .from('nfts')
        .select('time_left, title')
        .eq('id', id)
        .single()

    if (error || !nft) {
        return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    if (!nft.time_left) {
        return NextResponse.json({ error: 'Download URL not configured' }, { status: 404 })
    }

    // Increment download count (Atomic update)
    // We ignore errors here so the user still gets their download even if the counter fails
    await supabase.rpc('increment_downloads', { app_id: id })

    // Redirect directly to the download URL for maximum speed
    // The user downloads directly from the source instead of proxying through Vercel
    return NextResponse.redirect(nft.time_left)
}
