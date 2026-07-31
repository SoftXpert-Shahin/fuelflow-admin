import { supabase } from "./supabase";

export async function getSettings() {
    const { data, error } = await supabase
        .from("app_content")
        .select("*")
        .eq("slug", "settings")
        .single();

    if (error) throw error;

    return data;
}

export async function updateSettings(values: any) {
    const { error } = await supabase
        .from("app_content")
        .update(values)
        .eq("slug", "settings");

    if (error) throw error;
}

 
export async function updateLegalPage(
    slug: string,
    content: string
) {
    const { error } = await supabase
        .from("app_content")
        .update({
            content,
            updated_at: new Date().toISOString(),
        })
        .eq("slug", slug);

    if (error) throw error;
}

export async function getLegalPages() {
    const { data, error } = await supabase
        .from("app_content")
        .select("*")
        .neq("slug", "settings")
        .order("title");

    if (error) throw error;

    return data ?? [];
}
