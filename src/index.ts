import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import dotenv from "dotenv";
dotenv.config();

import { optionalAuth } from "./middlewares/auth.js";
import { authApp } from "./routes/auth.js";
import { propertyApp } from "./routes/properties.js";
import { bookingApp } from "./routes/booking.js";

process.on("uncaughtException", (err) => {
  console.error("❌ Ohanterat fel:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Ohanterat Promise-fel:", err);
});


const app = new Hono({
  strict: false,
});

const serverStartTime = Date.now();

app.use(
  "*",
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// optionalAuth brukar vara "optional" (sätter user om cookie finns).
// Det är OK att använda globalt så att handlers kan läsa req.user när inloggad.
app.use("*", optionalAuth);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Routes
app.route("/auth", authApp);          // /auth/login, /auth/register, etc.
app.route("/properties", propertyApp); // CRUD för property
app.route("/bookings", bookingApp);    // CRUD för booking

app.get("/health", (c) => {
  const now = Date.now();
  const uptimeSeconds = Math.floor((now - serverStartTime) / 1000);

  return c.json({
    status: "ok",
    message: "Service is healthy",
    uptime: uptimeSeconds,
    startedAt: new Date(serverStartTime).toISOString(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    console.log("managed risk error:", err);
    return err.getResponse();
  }
  console.error("unexpected error", err);
  return c.json({ error: "Internal server error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);


/*
//kod funkar ihop med index.ts och auth.ts ok registrering och login
// === src/index.ts ===
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import dotenv from "dotenv";
dotenv.config();

// ⚠️ Viktigt: även om vi använder TypeScript måste vi ha ".js" på importerna,
// annars hittar Node inte filerna när de kompileras.
import { optionalAuth } from "./middlewares/auth.js";
import { authApp } from "./routes/auth.js";
import { propertyApp } from "./routes/property.js";
import { bookingApp } from "./routes/booking.js";

const app = new Hono({ strict: false });
const serverStartTime = Date.now();

// 🌐 CORS-inställningar
app.use(
  "*",
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔑 Lägg till auth på alla requests (kan vara tom)
app.use("*", optionalAuth);

// 🏠 Root route
app.get("/", (c) => c.text("Hello Hono!"));

// 🔹 Routes
app.route("/auth", authApp);
app.route("/property", propertyApp);
app.route("/booking", bookingApp);

// 🩺 Health check
app.get("/health", (c) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  return c.json({
    status: "ok",
    uptime: uptimeSeconds,
    startedAt: new Date(serverStartTime).toISOString(),
    timestamp: new Date().toISOString(),
  });
});

// ⚠️ Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error("Unexpected error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// 🚀 Starta servern
serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => console.log(`✅ Server running on http://localhost:${info.port}`)
);*/



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
