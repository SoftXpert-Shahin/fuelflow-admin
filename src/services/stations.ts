import { supabase } from "./supabase";

export async function getStations() {
    const { data, error } = await supabase
        .from("fuel_stations")
        .select("*")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function getStationById(
    id: string,
) {
    const { data, error } = await supabase
        .from("fuel_stations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function createStation(values: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    active: boolean;
}) {
    const { error } = await supabase
        .from("fuel_stations")
        .insert(values);

    if (error) {
        throw error;
    }
}

export async function updateStation(
    id: string,
    values: {
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        active: boolean;
    },
) {
    const { error } = await supabase
        .from("fuel_stations")
        .update(values)
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export async function deleteStation(
    id: string,
) {
    const { error } = await supabase
        .from("fuel_stations")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export function subscribeStations(
    callback: () => void,
) {
    const channel = supabase
        .channel("fuel_stations")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "fuel_stations",
            },
            callback,
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}