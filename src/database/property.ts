// src/database/property.ts
import { supabase } from "../lib/supabase";
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
}