import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const authApp = new Hono();

// REGISTER
authApp.post("/register", async (c) => {
  const body = await c.req.json();
  console.log("📦 Mottagen body (register):", body); // ← loggar request body
  const { email, password } = body;

  if (!email || !password) {
    throw new HTTPException(400, { message: "Email and password are required" });
  }

  const supabase = c.get("supabase");
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.log("❌ Supabase error (register):", error); // ← loggar Supabase error
    throw new HTTPException(400, { message: error.message });
  }

  console.log("✅ User registered:", data.user?.email); // ← loggar registrerad användare
  return c.json(data.user, 200);
});

// LOGIN
authApp.post("/login", async (c) => {
  const body = await c.req.json();
  console.log("📦 Mottagen body (login):", body); // ← loggar request body
  const { email, password } = body;

  if (!email || !password) {
    throw new HTTPException(400, { message: "Email and password are required" });
  }

  const supabase = c.get("supabase");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log("❌ Supabase error (login):", error); // ← loggar Supabase error
    throw new HTTPException(400, { message: error.message });
  }

  console.log("✅ User logged in:", data.user?.email); // ← loggar inloggad användare
  return c.json(data.user, 200);
});



// src/routes/auth.ts
/*import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const authApp = new Hono();

authApp.post('/register', async (c) => {
  const { email, password } = await c.req.json();
  const supabase = c.get('supabase');
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new HTTPException(400, { message: error.message });
  }

  return c.json(data.user, 200);
});

authApp.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  const supabase = c.get('supabase');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new HTTPException(400, { message: error.message });
  }

  return c.json(data.user, 200);
});*/
