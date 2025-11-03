import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property } from "../types/property.js";

// Skapa ny property
export async function createProperty(
  sb: SupabaseClient,
  userId: string,
  data: Omit<Property, "id" | "user_id">
) {
  const { data: created, error } = await sb
    .from("properties")
    .insert([{ ...data, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return created;
}

// Hämta alla properties
export async function getProperties(sb: SupabaseClient) {
  const { data, error } = await sb.from("properties").select("*");
  if (error) throw error;
  return data;
}

// Hämta property med specifikt id
export async function getPropertyById(sb: SupabaseClient, id: string) {
  const { data, error } = await sb.from("properties").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Uppdatera property
export async function updateProperty(
  sb: SupabaseClient,
  userId: string,
  id: string,
  data: Partial<Property>
) {
  const { data: existing, error: fetchError } = await sb.from("properties").select("*").eq("id", id).single();
  if (fetchError) throw fetchError;
  if (existing.user_id !== userId) throw new Error("Inte tillåtet");

  const { data: updated, error } = await sb.from("properties").update(data).eq("id", id).select().single();
  if (error) throw error;
  return updated;
}

// Ta bort property
export async function deleteProperty(sb: SupabaseClient, userId: string, id: string) {
  const { data: existing, error: fetchError } = await sb.from("properties").select("*").eq("id", id).single();
  if (fetchError) throw fetchError;
  if (existing.user_id !== userId) throw new Error("Inte tillåtet");

  const { error } = await sb.from("properties").delete().eq("id", id);
  if (error) throw error;
  return { message: "Property borttagen" };
}




/*port { supabase } from "../lib/supabase.js";
import { Property } from "../types/property.js";

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from("properties").select("*");
  if (error) throw error;
  return data as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Property;
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase.from("properties").insert([property]).select().single();
  if (error) throw error;
  return data as Property;
}

export async function updateProperty(id: string, property: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase.from("properties").update(property).eq("id", id).select().single();
  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}
*/

// src/database/property.ts
/*import { supabase } from "../lib/supabase";
import { Property } from "../types/property";

// Hämta alla properties
export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from<Property>("properties").select("*");
  if (error) throw error;
  return data || [];
}

// Hämta property med ID
export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from<Property>("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Skapa ny property
export async function createProperty(property: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase.from<Property>("properties").insert([property]);
  if (error) throw error;
  return data![0];
}

// Uppdatera property
export async function updateProperty(
  id: string,
  property: Partial<Property>
): Promise<Property> {
  const { data, error } = await supabase.from<Property>("properties").update(property).eq("id", id);
  if (error) throw error;
  return data![0];
}

// Ta bort property
export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from<Property>("properties").delete().eq("id", id);
  if (error) throw error;
}*/