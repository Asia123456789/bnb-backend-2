// === src/routes/booking.ts ===
import { Hono } from "hono";
import { requireAuth } from "../middlewares/auth.js";

export const bookingApp = new Hono();

/**
 * GET /booking
 * Hämtar alla bokningar (mock)
 */
bookingApp.get("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    console.log("GET /booking - user:", user);

    return c.json(
      [
        { id: 1, property: "Cozy Apartment", status: "Confirmed", userId: user?.id }
      ],
      200
    );
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
    const user = c.get("user");
    console.log("POST /booking body:", body);
    console.log("User:", user);

    if (!body || !body.propertyId || !body.checkIn || !body.checkOut) {
      return c.json({ error: "Missing booking data" }, 400);
    }

    const booking = {
      id: Math.floor(Math.random() * 10000),
      propertyId: body.propertyId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      totalPrice: 1000, // placeholder
      userId: user?.id,
    };

    console.log("✅ Created booking:", booking);

    return c.json({ message: "Booking created", data: booking }, 201);
  } catch (err) {
    console.error("❌ Booking POST error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});


// === src/routes/booking.ts ===
/*port { Hono } from "hono";
import { requireAuth } from "../middlewares/auth.js";

export const bookingApp = new Hono();

bookingApp.get("/", requireAuth, async (c) => {
  return c.json([{ id: 1, property: "Cozy Apartment", status: "Confirmed" }]);
});

bookingApp.post("/", requireAuth, async (c) => {
  const body = await c.req.json();
  return c.json({ message: "Booking created", data: body });
});*/
