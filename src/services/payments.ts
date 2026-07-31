import { supabase } from "./supabase";

export async function getPayments() {
    const { data, error } = await supabase
        .from("payments")
        .select(`
            *,
            order:orders(
                id
            ),
            customer:profiles(
                full_name
            )
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return (
        data?.map((payment) => ({
            id: payment.id,
            transaction_id: payment.transaction_id,
            payment_method: payment.payment_method,
            amount: payment.amount,
            status: payment.status,
            created_at: payment.created_at,
            order_id: payment.order?.id,
            customer_name:
                payment.customer?.full_name ??
                "Unknown",
        })) ?? []
    );
}

export async function getPaymentById(
    id: string,
) {
    const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function updatePaymentStatus(
    id: string,
    status: string,
) {
    const { error } = await supabase
        .from("payments")
        .update({
            status,
        })
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export async function refundPayment(
    id: string,
) {
    const { error } = await supabase
        .from("payments")
        .update({
            status: "refunded",
        })
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export function subscribePayments(
    callback: () => void,
) {
    const channel = supabase
        .channel("payments")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "payments",
            },
            callback,
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}