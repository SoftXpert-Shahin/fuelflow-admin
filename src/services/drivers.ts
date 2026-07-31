import { supabase } from "./supabase";

export async function getDrivers() {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            email,
            phone,
            avatar_url,
            is_online,
            created_at,
            role
        `)
        .eq("role", "driver")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export function subscribeDrivers(
    callback: () => void,
) {
    const channel = supabase

        .channel("drivers")

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

export async function getDriverById(
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

export async function updateDriver(
    id: string,
    values: {
        full_name: string;
        phone: string;
        email: string;
        is_online: boolean;
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

export async function deleteDriver(
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