import { supabase } from "./supabase";

type NotificationInput = {
    title: string;
    message: string;
    target: string;
};

export async function getNotifications() {
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function sendNotification(
    values: NotificationInput,
) {
    const { error } = await supabase
        .from("notifications")
        .insert({
            title: values.title,
            message: values.message,
            target: values.target,
            is_sent: true,
        });

    if (error) {
        throw error;
    }
}

export async function deleteNotification(
    id: string,
) {
    const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export async function markNotificationRead(
    id: string,
) {
    const { error } = await supabase
        .from("notifications")
        .update({
            is_read: true,
        })
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export function subscribeNotifications(
    callback: () => void,
) {
    const channel = supabase
        .channel("notifications")

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "notifications",
            },
            callback,
        )

        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}