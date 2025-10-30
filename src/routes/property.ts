// src/routes/property.ts
import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { Property } from "../types/property";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../database/property";

export const propertyApp = new Hono();

// Hämta alla properties
propertyApp.get("/", async (c) => {
  const properties = await getProperties();
  return c.json(properties, 200);
});

// Hämta property med ID
propertyApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const property = await getPropertyById(id);
  if (!property) return c.json({ message: "Property not found" }, 404);
  return c.json(property, 200);
});

// Skapa property (måste vara inloggad)
propertyApp.post("/", async (c) => {
  await requireAuth(c, async () => {});
  const body = await c.req.json() as Partial<Property>;
  const user = c.get("user");
  const newProperty = await createProperty({ ...body, owner_id: user?.id });
  return c.json(newProperty, 201);
});

// Uppdatera property
propertyApp.put("/:id", async (c) => {
  await requireAuth(c, async () => {});
  const id = c.req.param("id");
  const body = await c.req.json() as Partial<Property>;
  const updated = await updateProperty(id, body);
  return c.json(updated, 200);
});

// Ta bort property
propertyApp.delete("/:id", async (c) => {
  await requireAuth(c, async () => {});
  const id = c.req.param("id");
  await deleteProperty(id);
  return c.json({ message: "Property deleted" }, 200);
});
