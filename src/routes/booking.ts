// === src/routes/booking.ts ===
import { Hono } from "hono";
import { requireAuth } from "../middlewares/auth.js";
import moment from "moment";
import { getPropertyById } from "../database/property.js";
import { createBooking, getBookings } from "../database/booking.js";


export const bookingApp = new Hono();

/**
 * GET /booking
 * Hämtar alla bokningar (mock)
 */
bookingApp.get("/", requireAuth, async (c) => {
  try {
    const sb = c.get("supabase");
    const user = c.get("user")!;
    const bookings = await getBookings(sb, user.id); // <-- använd user.id här
    console.log("GET /booking - user:", user);

    return c.json(bookings,200);
  } catch (err) {
    console.error("❌ Booking GET error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * POST /booking
 * Skapar en ny bokning
 */
bookingApp.post("/", requireAuth, async (c) => {
  try {
    const body = await c.req.json(); // <- kan kasta SyntaxError
    const sb = c.get("supabase");
    const user = c.get("user")!;
    console.log("POST /booking body:", body);
    console.log("User:", user);

    if (!body || !body.propertyId || !body.checkIn || !body.checkOut) {
      return c.json({ error: "Missing booking data" }, 400);
    }
    console.log("Creating booking for property:", body.propertyId, user);
    const booking = await createBooking(sb, user.id, {
      property_id: body.propertyId,
      check_in: body.checkIn,   // skicka som ren sträng
      check_out: body.checkOut, // skicka som ren sträng
    });


    console.log("✅ Created booking:", booking);

    return c.json({ message: "Booking created", data: booking }, 201);
  } catch (err) {
    console.error("❌ Booking POST error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});


