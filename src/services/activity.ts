import { supabase } from "./supabase";

export async function getActivities() {
    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            status,
            fuel_type,
            liters,
            total_price,
            created_at,
            customer:profiles!orders_customer_id_fkey(
                full_name
            )
        `)
        .order("created_at", {
            ascending: false,
        })
        .limit(20);

    if (error) throw error;

    return data ?? [];
}

export function subscribeActivities(
    callback: () => void
) {
    const channel = supabase
        .channel("dashboard-activity")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "orders",
            },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}