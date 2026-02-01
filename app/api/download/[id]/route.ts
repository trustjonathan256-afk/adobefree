import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use Edge runtime for better streaming performance
export const runtime = 'edge'

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

    try {
        // Fetch the file from source with streaming
        const response = await fetch(nft.time_left, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
            },
        })

        if (!response.ok || !response.body) {
            throw new Error('Failed to fetch file')
        }

        // Get headers from source
        const contentType = response.headers.get('content-type') || 'application/octet-stream'
        const contentLength = response.headers.get('content-length')

        // Generate safe filename
        const safeTitle = nft.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')
        const extension = getExtensionFromContentType(contentType)
        const filename = `${safeTitle}${extension}`

        // Build response headers
        const headers: HeadersInit = {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Content-Type-Options': 'nosniff',
        }

        if (contentLength) {
            headers['Content-Length'] = contentLength
        }

        // Stream the response body directly (efficient, no buffering)
        return new NextResponse(response.body, {
            status: 200,
            headers,
        })

    } catch (fetchError) {
        console.error('Download proxy error:', fetchError)
        return NextResponse.json(
            { error: 'Download failed. Please try again.' },
            { status: 500 }
        )
    }
}

function getExtensionFromContentType(contentType: string): string {
    const mimeToExt: Record<string, string> = {
        'application/zip': '.zip',
        'application/x-zip-compressed': '.zip',
        'application/x-rar-compressed': '.rar',
        'application/x-7z-compressed': '.7z',
        'application/x-tar': '.tar',
        'application/gzip': '.gz',
        'application/pdf': '.pdf',
        'application/x-msdownload': '.exe',
        'application/x-msdos-program': '.exe',
        'application/octet-stream': '',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'video/mp4': '.mp4',
    }

    const baseType = contentType.split(';')[0].trim().toLowerCase()
    return mimeToExt[baseType] || ''
}
