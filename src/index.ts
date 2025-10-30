import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { optionalAuth } from "./middleware/auth";
import { authApp } from "./routes/auth";
import { propertyApp } from "./routes/property";
import { bookingApp } from "./routes/booking";

const app = new Hono();

// Global middleware
app.use("*", optionalAuth);

// Root-route
app.get("/", (c) => {
  const user = c.get("user");
  if (user) {
    return c.text(`Bnb backend running 🚀 Logged in as ${user.email}`);
  }
  return c.text("Bnb backend running 🚀 Not logged in");
});

// Mount alla routes **innan serve()**
app.route("/auth", authApp);
app.route("/property", propertyApp);
app.route("/booking", bookingApp);

// Starta servern
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Server running at http://localhost:3000");



/*import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { optionalAuth } from "./middleware/auth";
import { authApp } from "./routes/auth"; // ← importera auth-routes

const app = new Hono();

// Global middleware
app.use("*", optionalAuth);

// Root-route
app.get("/", (c) => {
  const user = c.get("user");
  if (user) {
    return c.text(`Bnb backend running 🚀 Logged in as ${user.email}`);
  }
  return c.text("Bnb backend running 🚀 Not logged in");
});

// Mount auth routes på /auth
app.route("/auth", authApp);

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Server running at http://localhost:3000");*/
