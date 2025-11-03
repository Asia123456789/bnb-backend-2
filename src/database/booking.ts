
// src/database/booking.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";
import { Booking } from "../types/booking.js";
import { getPropertyById } from "./property.js";
// Hämta alla bookings
export async function getBookings(sb: SupabaseClient, user_id: string): Promise<Booking[]> {
  const { data, error } = await sb.from("bookings").select("*").eq("user_id", user_id);
  if (error) throw error;
  return data || [];
}

// Hämta booking med ID
export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Skapa ny booking med automatisk totalpris
export async function createBooking(sb: SupabaseClient, user_id: string, booking: Partial<Booking>): Promise<Booking> {
  if (!booking.property_id || !booking.check_in || !booking.check_out)
    throw new Error("Missing required fields");

  const property = await getPropertyById(sb, booking.property_id);
  //TODO handle null property
  if (!property) throw new Error("Property not found");

  const nights =
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
    (1000 * 60 * 60 * 24);
  const total_price = property.price_per_night * nights;

  const bookingData = { ...booking, total_price, user_id };

  console.log("Creating booking with data:", bookingData);

  const { data, error } = await supabase
    .from("bookings")
    .insert(bookingData).select("*").single();

  if (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
  return data;
}

// Ta bort booking
/*export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from<Booking>("bookings").delete().eq("id", id);
  if (error) throw error;
}*/