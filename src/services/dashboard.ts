import { supabase } from "./supabase";

export async function getDashboardStats() {
    const [
        orders,
        customers,
        drivers,
    ] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("profiles").select("*").eq("role", "customer"),
        supabase.from("profiles").select("*").eq("role", "driver"),
    ]);

    const orderData = orders.data ?? [];

    return {
        totalOrders: orderData.length,

        pendingOrders: orderData.filter(
            o => o.status === "pending"
        ).length,

        activeOrders: orderData.filter(
            o =>
                o.status === "accepted" ||
                o.status === "delivering" ||
                o.status === "arrived"
        ).length,

        completedOrders: orderData.filter(
            o => o.status === "completed"
        ).length,

        totalRevenue: orderData
            .filter(o => o.status === "completed")
            .reduce(
                (sum, o) => sum + Number(o.total_price ?? 0),
                0
            ),

        totalCustomers: customers.data?.length ?? 0,

        totalDrivers: drivers.data?.length ?? 0,

        onlineDrivers:
            drivers.data?.filter(d => d.is_online).length ?? 0,
    };
}

export function subscribeDashboard(callback: () => void) {
    const channel = supabase
        .channel("dashboard-live")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "orders",
            },
            callback
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "profiles",
            },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}