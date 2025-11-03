// === src/validators/authValidators.ts ===
import { HTTPException } from "hono/http-exception";

export const registerValidator = async (c: any, next: any) => {
  const body = await c.req.json();
  if (!body.email || !body.password) {
    throw new HTTPException(400, { res: c.json({ error: "Email and password required" }, 400) });
  }
  return next();
};
