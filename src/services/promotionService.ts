import { supabase } from "./supabase";

export async function getPromotions() {
    const { data, error } = await supabase
        .from("promotion_banners")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) throw error;

    return data ?? [];
}

export async function createPromotion(values: any) {
    const { error } = await supabase
        .from("promotion_banners")
        .insert(values);

    if (error) throw error;
}

export async function updatePromotion(id: string, values: any) {
    const { error } = await supabase
        .from("promotion_banners")
        .update(values)
        .eq("id", id);

    if (error) throw error;
}

export async function deletePromotion(id: string) {
    const { error } = await supabase
        .from("promotion_banners")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export function subscribeToPromotions(callback: () => void) {
    const channel = supabase
        .channel("promotion-banners")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "promotion_banners",
            },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}