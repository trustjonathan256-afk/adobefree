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

export type ActionState = {
    message?: string
    error?: string
}

export async function createNFT(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
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
            console.log('Uploading file:', filename);
            const { data, error } = await supabase.storage.from('nfts').upload(filename, imageFile)

            if (error) {
                console.error('Supabase Storage Upload Error:', error)
                return { error: `Upload failed: ${error.message}` }
            }

            const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
            publicUrl = urlData.publicUrl
        } else {
            // Handle case where image is required
            // throwing error to be caught below
            return { error: "Image is required to create an App." }
        }

        // Get the max display_order to add new app at the end
        const { data: maxOrderData, error: orderError } = await supabase
            .from('nfts')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1)

        if (orderError) {
            console.error('Error fetching max order:', orderError);
            // We proceed, as this isn't critical enough to block creation usually, 
            // but it's good to note.
        }

        const nextOrder = (maxOrderData?.[0]?.display_order ?? -1) + 1

        const { error: insertError } = await supabase.from('nfts').insert({
            title,
            creator,
            price,
            category_id,
            time_left,
            image_url: publicUrl,
            display_order: nextOrder
        })

        if (insertError) {
            console.error('Supabase DB Insert Error:', insertError)
            return { error: `Database insert failed: ${insertError.message}` }
        }

        revalidatePath('/admin/nfts')
        revalidatePath('/admin')
        revalidatePath('/')

        // Success message
        return { message: 'NFT created successfully!' }

    } catch (e) {
        console.error('Server Action createNFT Error:', e)
        return { error: 'An unexpected error occurred. Please try again.' }
    }
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
