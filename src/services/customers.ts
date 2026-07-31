import { supabase } from "./supabase";

export async function getCustomers() {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            email,
            phone,
            avatar_url,
            created_at,
            is_online,
            role
        `)
        .eq("role", "customer")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export function subscribeCustomers(
    callback: () => void,
) {
    const channel = supabase
        .channel("customers")

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "profiles",
            },
            callback,
        )

        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

export async function getCustomerById(
    id: string,
) {
    const { data, error } = await supabase

        .from("profiles")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteCustomer(
    id: string,
) {
    const { error } = await supabase

        .from("profiles")

        .delete()

        .eq("id", id);

    if (error) {
        throw error;
    }
}

export async function updateCustomer(
    id: string,
    values: {
        full_name: string;
        phone: string;
        email: string;
    },
) {
    const { error } = await supabase

        .from("profiles")

        .update(values)

        .eq("id", id);

    if (error) {
        throw error;
    }
}