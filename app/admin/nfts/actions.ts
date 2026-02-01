'use server'
import { createClient } from '../../utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteNFT(id: string) {
    const supabase = await createClient()
    await supabase.from('nfts').delete().eq('id', id)
    revalidatePath('/admin/nfts')
    revalidatePath('/admin')
}

export async function createNFT(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const creator = formData.get('creator') as string
    const price = formData.get('price') as string
    const category_id = formData.get('category_id') as string
    const time_left = formData.get('time_left') as string
    const imageFile = formData.get('image') as File

    let publicUrl = ''

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
        const { data, error } = await supabase.storage.from('nfts').upload(filename, imageFile)

        if (error) {
            console.error('Upload error:', error)
            // Ideally return error state
            return
        }

        const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
        publicUrl = urlData.publicUrl
    } else {
        // Handle missing image? Or allow default?
        // For now require it or set empty string (but DB has not null)
        // Check schema: image_url text not null
        // So we must have an image.
        // If fail, we crash/redirect.
        // For simplicity:
        return;
    }

    // Get the max display_order to add new app at the end
    const { data: maxOrderData } = await supabase
        .from('nfts')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)

    const nextOrder = (maxOrderData?.[0]?.display_order ?? -1) + 1

    await supabase.from('nfts').insert({
        title,
        creator,
        price,
        category_id,
        time_left,
        image_url: publicUrl,
        display_order: nextOrder
    })

    revalidatePath('/admin/nfts')
    revalidatePath('/admin')
    revalidatePath('/')
    redirect('/admin/nfts')
}

export async function updateNFTOrder(
    nfts: { id: string; display_order: number }[]
) {
    const supabase = await createClient()

    // Update each NFT's display_order
    for (const nft of nfts) {
        await supabase
            .from('nfts')
            .update({ display_order: nft.display_order })
            .eq('id', nft.id)
    }

    revalidatePath('/admin/nfts')
    revalidatePath('/') // Revalidate homepage too
}

export async function updateNFT(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const creator = formData.get('creator') as string
    const price = formData.get('price') as string
    const category_id = formData.get('category_id') as string
    const time_left = formData.get('time_left') as string
    const imageFile = formData.get('image') as File
    let publicUrl = formData.get('current_image_url') as string

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
        const { data, error } = await supabase.storage.from('nfts').upload(filename, imageFile)

        if (error) {
            console.error('Upload error:', error)
            // Proceed with old image?
        } else {
            const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
            publicUrl = urlData.publicUrl
        }
    }

    await supabase.from('nfts').update({
        title,
        creator,
        price,
        category_id,
        time_left,
        image_url: publicUrl
    }).eq('id', id)

    revalidatePath('/admin/nfts')
    revalidatePath('/admin')
    redirect('/admin/nfts')
}
