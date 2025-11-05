//src/database/user.ts
import type { PostgrestSingleResponse, SupabaseClient, User } from "@supabase/supabase-js";

export async function getProfile(sb: SupabaseClient, uid: string){
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("user_id", uid)
    .single();
  return data;
}

export async function updateProfile(sb: SupabaseClient, uid: string, user: any) {
    const { data, error } = await sb
        .from("profiles")
        .update(user)
        .eq("user_id", uid)
        .select()
        .single();
    return data;
}