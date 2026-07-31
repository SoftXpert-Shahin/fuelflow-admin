import { supabase } from "./supabase";

export async function getFuelPrices() {
    const { data, error } = await supabase
        .from("fuel_prices")
        .select("*")
        .order("fuel_type");

    if (error) throw error;

    return data ?? [];
}

export async function updateFuelPrice(
    id: string,
    price: number
) {
    const { error } = await supabase
        .from("fuel_prices")
        .update({
            price_per_liter: price,
        })
        .eq("id", id);

    if (error) throw error;
}

export async function getDeliverySettings() {
    const { data, error } = await supabase
        .from("delivery_settings")
        .select("*")
        .limit(1)
        .single();

    if (error) throw error;

    return data;
}

export async function updateDeliverySettings(
    values: {
        price_per_km: number;
        minimum_delivery_fee: number;
        maximum_delivery_fee: number | null;
    }
) {
    const { error } = await supabase
        .from("delivery_settings")
        .update(values)
        .eq("is_active", true);

    if (error) throw error;
}

export async function getPricingConfig() {
    const [fuelResult, deliveryResult, settingsResult] =
        await Promise.all([
            supabase
                .from("fuel_prices")
                .select("*")
                .eq("active", true),

            supabase
                .from("delivery_settings")
                .select("*")
                .eq("is_active", true)
                .single(),

            supabase
                .from("app_content")
                .select("currency_symbol, platform_fee")
                .eq("slug", "settings")
                .single(),
        ]);

    if (fuelResult.error) throw fuelResult.error;
    if (deliveryResult.error) throw deliveryResult.error;
    if (settingsResult.error) throw settingsResult.error;

    return {
        fuels: fuelResult.data,
        delivery: deliveryResult.data,
        settings: settingsResult.data,
    };
}
export function subscribeToPricing(onChange: () => void) {
    const channel = supabase
        .channel("pricing-config")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "fuel_prices",
            },
            (payload) => {
                console.log("🔥 Fuel Changed", payload);
                onChange();
            }
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "delivery_settings",
            },
            (payload) => {
                console.log("🚚 Delivery Changed", payload);
                onChange();
            }
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "app_content",
            },
            (payload) => {
                console.log("⚙️ App Content Changed", payload);
                onChange();
            }
        )
        .subscribe((status) => {
            console.log("Pricing Status:", status);
        });

    return () => {
        channel.unsubscribe();
    };
}
export async function getCurrencySymbol() {
    const { settings } = await getPricingConfig();
    return settings.currency_symbol;
}