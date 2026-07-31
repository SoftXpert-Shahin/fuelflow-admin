import { supabase } from "./supabase";

 
export async function getOrders(search = "", status = "all") {
  let query = supabase
    .from("orders")
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey(
        id,
        full_name,
        phone,
        avatar_url
      )
    `);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) throw error;

  if (!orders) return [];

  // Load all driver profiles
  const driverIds = [
    ...new Set(
      orders
        .filter((o) => o.driver_id)
        .map((o) => o.driver_id)
    ),
  ];

  let drivers: any[] = [];

  if (driverIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url")
      .in("id", driverIds);

    drivers = data ?? [];
  }

  const driverMap = new Map(
    drivers.map((d) => [d.id, d])
  );

  return orders.map((order) => ({
    ...order,
    driver: driverMap.get(order.driver_id) ?? null,
  }));
}
export async function getOrderDetails(id: string) {
    const { data: order, error } = await supabase
        .from("orders")
        .select(`
            *,
            customer:profiles!orders_customer_id_fkey(
                id,
                full_name,
                phone,
                email,
                avatar_url
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;

    let driver = null;

    if (order.driver_id) {
        const { data } = await supabase
            .from("profiles")
            .select(`
                id,
                full_name,
                phone,
                email,
                avatar_url
            `)
            .eq("id", order.driver_id)
            .maybeSingle();

        driver = data;
    }

    return {
        ...order,
        driver,
    };
}
export function subscribeOrders(callback: () => void) {
    const channel = supabase.channel(
        `orders-${crypto.randomUUID()}`
    );

    channel.on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "orders",
        },
        () => {
            callback();
        }
    );

    channel.subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

export async function updateOrderStatus(
    orderId: string,
    status: string,
) {
    const { error } = await supabase
        .from("orders")
        .update({
            status,
        })
        .eq("id", orderId);

    if (error) throw error;
}

export async function assignDriver(
    orderId: string,
    driverId: string,
) {
    const { error } = await supabase
        .from("orders")
        .update({
            driver_id: driverId,
        })
        .eq("id", orderId);

    if (error) throw error;
}

export async function deleteOrder(
    orderId: string,
) {
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

    if (error) throw error;
}

export async function getAvailableDrivers() {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            phone,
            avatar_url
        `)
        .eq("role", "driver")
        .eq("is_online", true)
        .order("full_name");

    if (error) throw error;

    return data ?? [];
}

export function subscribeOrder(
    orderId: string,
    callback: () => void,
) {
    const channel = supabase
        .channel(`order-${orderId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "orders",
                filter: `id=eq.${orderId}`,
            },
            callback,
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
export async function getLiveOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            status,
            created_at,
            total_price,
            customer:profiles!orders_customer_id_fkey(
                full_name
            )
        `)
        .in("status", [
            "pending",
            "accepted",
            "arrived",
            "delivering",
            "waiting_confirmation",
        ])
        .order("created_at", {
            ascending: false,
        })
        .limit(10);

    if (error) throw error;

    return data ?? [];
}