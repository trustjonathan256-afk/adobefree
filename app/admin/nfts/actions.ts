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
        const description = formData.get('description') as string
        const imageFile = formData.get('image') as File
        const productImageFile = formData.get('product_image') as File

        let publicUrl = ''
        let productImageUrl = ''

        // Upload Card Image
        if (imageFile && imageFile.size > 0) {
            const filename = `card-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
            const { error } = await supabase.storage.from('nfts').upload(filename, imageFile)

            if (error) {
                console.error('Supabase Storage Upload Error (Card):', error)
                return { error: `Card Image Upload failed: ${error.message}` }
            }

            const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
            publicUrl = urlData.publicUrl
        } else {
            return { error: "Card Image is required." }
        }

        // Upload Product Image (Optional, or fallback to Card Image?)
        // Let's make it optional - if not provided, just leave null or use logic elsewhere
        if (productImageFile && productImageFile.size > 0) {
            const filename = `product-${Date.now()}-${productImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
            const { error } = await supabase.storage.from('nfts').upload(filename, productImageFile)

            if (error) {
                console.error('Supabase Storage Upload Error (Product):', error)
                // Don't fail entire creation for this? Or strictly fail? Let's fail to be safe.
                return { error: `Product Image Upload failed: ${error.message}` }
            }

            const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
            productImageUrl = urlData.publicUrl
        }

        const { data: maxOrderData, error: orderError } = await supabase
            .from('nfts')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1)

        const nextOrder = (maxOrderData?.[0]?.display_order ?? -1) + 1

        const { error: insertError } = await supabase.from('nfts').insert({
            title,
            creator,
            price,
            category_id,
            time_left,
            image_url: publicUrl,
            product_image_url: productImageUrl || null, // Allow null if not uploaded
            display_order: nextOrder,
            description
        })

        if (insertError) {
            console.error('Supabase DB Insert Error:', insertError)
            return { error: `Database insert failed: ${insertError.message}` }
        }

        revalidatePath('/admin/nfts')
        revalidatePath('/admin')
        revalidatePath('/')

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

    for (const nft of nfts) {
        await supabase
            .from('nfts')
            .update({ display_order: nft.display_order })
            .eq('id', nft.id)
    }

    revalidatePath('/admin/nfts')
    revalidatePath('/')
}

export async function updateNFT(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const creator = formData.get('creator') as string
    const price = formData.get('price') as string
    const category_id = formData.get('category_id') as string
    const time_left = formData.get('time_left') as string
    const description = formData.get('description') as string

    // Card Image
    const imageFile = formData.get('image') as File
    let publicUrl = formData.get('current_image_url') as string

    // Product Image
    const productImageFile = formData.get('product_image') as File
    let productImageUrl = formData.get('current_product_image_url') as string

    // Handle Card Image Upload
    if (imageFile && imageFile.size > 0) {
        const filename = `card-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
        const { error } = await supabase.storage.from('nfts').upload(filename, imageFile)

        if (!error) {
            const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
            publicUrl = urlData.publicUrl
        }
    }

    // Handle Product Image Upload
    if (productImageFile && productImageFile.size > 0) {
        const filename = `product-${Date.now()}-${productImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
        const { error } = await supabase.storage.from('nfts').upload(filename, productImageFile)

        if (!error) {
            const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filename)
            productImageUrl = urlData.publicUrl
        }
    }

    await supabase.from('nfts').update({
        title,
        creator,
        price,
        category_id,
        time_left,
        description,
        image_url: publicUrl,
        product_image_url: productImageUrl || null
    }).eq('id', id)

    revalidatePath('/admin/nfts')
    revalidatePath('/admin')
    redirect('/admin/nfts')
}
