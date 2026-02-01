"use server";

import { createClient } from "../utils/supabase/server";

export async function getFileSize(id: string) {
    const supabase = await createClient();

    const { data: nft } = await supabase
        .from("nfts")
        .select("time_left")
        .eq("id", id)
        .single();

    if (!nft || !nft.time_left) {
        return null;
    }

    try {
        const response = await fetch(nft.time_left, {
            method: "HEAD",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });

        const contentLength = response.headers.get("content-length");
        return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
        console.error("Failed to fetch file size:", error);
        return null;
    }
}
