// src/routes/booking.ts
import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { Booking } from "../types/booking";
import {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
} from "../database/booking";

export const bookingApp = new Hono();

// Hämta alla bookings
bookingApp.get("/", async (c) => {
  const bookings = await getBookings();
  return c.json(bookings, 200);
});

// Hämta booking med ID
bookingApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const booking = await getBookingById(id);
  if (!booking) return c.json({ message: "Booking not found" }, 404);
  return c.json(booking, 200);
});

// Skapa booking (måste vara inloggad)
bookingApp.post("/", async (c) => {
  await requireAuth(c, async () => {});
  const body = await c.req.json() as Partial<Booking>;
  const user = c.get("user");
  const newBooking = await createBooking({ ...body, user_id: user?.id });
  return c.json(newBooking, 201);
});

// Ta bort booking
bookingApp.delete("/:id", async (c) => {
  await requireAuth(c, async () => {});
  const id = c.req.param("id");
  await deleteBooking(id);
  return c.json({ message: "Booking deleted" }, 200);
});
