import { Hono } from "hono";
import { requireAuth, optionalAuth } from "../middlewares/auth.js";
import * as propertyDb from "../database/property.js";

export const propertyApp = new Hono();

// Skapa property
propertyApp.post("/", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  const body = await c.req.json();
  console.log("Creating property for user:", user.id);
  const property = await propertyDb.createProperty(sb, user.id, body);
  return c.json(property, 200);
});

// Hämta alla properties
propertyApp.get("/", optionalAuth, async (c) => {
  const sb = c.get("supabase");
  const properties = await propertyDb.getProperties(sb);
  return c.json(properties, 200);
});

// Hämta en property
propertyApp.get("/:id", optionalAuth, async (c) => {
  const sb = c.get("supabase");
  const id = c.req.param("id");
  const property = await propertyDb.getPropertyById(sb, id);
  if (!property) {
    return c.json({ error: "Objektet hittades inte" }, 404);
  }
  return c.json(property, 200);
});

// Uppdatera property
propertyApp.patch("/:id", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  console.log("PATCH user:", user.id); // <-- Lägg till detta
  const id = c.req.param("id");
  const body = await c.req.json();

  const updated = await propertyDb.updateProperty(sb, user.id, id, body);
    if (!updated) {
    return c.json({ error: "Objektet hittades inte" }, 404);
  }
  return c.json(updated, 200);
});

// Ta bort property
propertyApp.delete("/:id", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  const id = c.req.param("id");

  const result = await propertyDb.deleteProperty(sb, user.id, id);
  if(!result){
    return c.json({ error: "Objektet hittades inte" }, 404);
  }
  return c.json(result, 200);
});



// === src/routes/property.ts ===
/*
import { Hono } from "hono";
import { requireAuth } from "../middlewares/auth.js";

export const propertyApp = new Hono();

// GET all properties (mock)
propertyApp.get("/", async (c) => {
  return c.json([{ id: 1, title: "Cozy Apartment" }]);
});

// POST new property (auth required)
propertyApp.post("/", requireAuth, async (c) => {
  const body = await c.req.json();
  return c.json({ message: "Property created", data: body });
});*/
