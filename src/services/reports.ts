import { supabase } from "./supabase";

export async function getReportStats() {

    const [
        orders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        customers,
        drivers,
        onlineDrivers,
        stations,
        revenue,
    ] = await Promise.all([

        supabase
            .from("orders")
            .select("*", {
                count: "exact",
                head: true,
            }),

        supabase
            .from("orders")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("status", "completed"),

        supabase
            .from("orders")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("status", "pending"),

        supabase
            .from("orders")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("status", "cancelled"),

        supabase
            .from("profiles")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("role", "customer"),

        supabase
            .from("profiles")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("role", "driver"),

        supabase
            .from("profiles")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("role", "driver")
            .eq("is_online", true),

        supabase
            .from("fuel_stations")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("active", true),

        supabase
            .from("orders")
            .select("total_price")
            .eq("status", "completed"),

    ]);

    const totalRevenue =
        revenue.data?.reduce(
            (sum, order) =>
                sum + Number(order.total_price ?? 0),
            0,
        ) ?? 0;

    return {

        totalRevenue,

        totalOrders:
            orders.count ?? 0,

        completedOrders:
            completedOrders.count ?? 0,

        pendingOrders:
            pendingOrders.count ?? 0,

        cancelledOrders:
            cancelledOrders.count ?? 0,

        totalCustomers:
            customers.count ?? 0,

        totalDrivers:
            drivers.count ?? 0,

        onlineDrivers:
            onlineDrivers.count ?? 0,

        activeStations:
            stations.count ?? 0,

    };

}

export async function getMonthlyRevenue() {

    const { data, error } = await supabase
        .from("orders")
        .select("created_at,total_price")
        .eq("status", "completed");

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function getTopDrivers() {

    const { data, error } = await supabase
        .from("profiles")
        .select("id,full_name")
        .eq("role", "driver");

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function getTopCustomers() {

    const { data, error } = await supabase
        .from("profiles")
        .select("id,full_name")
        .eq("role", "customer");

    if (error) {
        throw error;
    }

    return data ?? [];
}