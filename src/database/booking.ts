// src/database/booking.ts
/*ort { supabase } from "../lib/supabase.js";
import { Booking } from "../types/booking.js";
import { getPropertyById } from "./property.js";

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from("bookings").select("*");
  if (error) throw error;
  return data as Booking[];
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Booking;
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  // Kontrollera obligatoriska fält
  if (!booking.property_id || !booking.check_in || !booking.check_out) {
    throw new Error("Missing fields");
  }

  const property = await getPropertyById(booking.property_id);
  if (!property) throw new Error("Property not found");

  const nights =
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
    (1000 * 60 * 60 * 24);

  const total_price = property.price_per_night * nights;

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...booking, total_price }])
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}*/


// src/database/booking.ts
/*import { supabase } from "../lib/supabase";
import { Booking } from "../types/booking";
import { getPropertyById } from "./property";

// Hämta alla bookings
export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from<Booking>("bookings").select("*");
  if (error) throw error;
  return data || [];
}

// Hämta booking med ID
export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from<Booking>("bookings")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Skapa ny booking med automatisk totalpris
export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  if (!booking.property_id || !booking.check_in || !booking.check_out)
    throw new Error("Missing required fields");

  const property = await getPropertyById(booking.property_id);
  if (!property) throw new Error("Property not found");

  const nights =
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
    (1000 * 60 * 60 * 24);
  const total_price = property.price_per_night * nights;

  const { data, error } = await supabase
    .from<Booking>("bookings")
    .insert([{ ...booking, total_price }]);
  if (error) throw error;
  return data![0];
}

// Ta bort booking
export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from<Booking>("bookings").delete().eq("id", id);
  if (error) throw error;
}*/