//src/routes/auth.ts
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { registerValidator } from "../validators/authValidators.js";
import { requireAuth } from "../middlewares/auth.js";
import * as userDb from "../database/user.js";

export const authApp = new Hono();

authApp.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const sb = c.get("supabase");
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Invalid credentials" }, 400),
    });
  }

  return c.json(data.user, 200);
});

authApp.post("/register", registerValidator, async (c) => {
  const { email, password } = await c.req.json();
  const sb = c.get("supabase");
  const response = await sb.auth.signUp({ email, password });
  if (response.error) {
    throw new HTTPException(400, {
      res: c.json({ error: response.error.message }, 400),
    });
  }

  return c.json(response.data.user, 200);
});

authApp.post("/refresh", async (c) => {
  const sb = c.get("supabase");
  const { data, error } = await sb.auth.refreshSession();

  if (error) {
    throw new HTTPException(401, {
      res: c.json({ error: "Unable to refresh session" }, 401),
    });
  }

  return c.json(
    {
      user: data.user,
      session: data.session,
    },
    200
  );
});

authApp.post("/logout", async (c) => {
  const sb = c.get("supabase");
  const { error } = await sb.auth.signOut();

  if (error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Unable to sign out" }, 400),
    });
  }

  return c.json({ message: "Successfully logged out" }, 200);
});


//? Me

authApp.get("/me", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  const profile = await userDb.getProfile(sb, user.id);
  return c.json(profile, 200);
});

authApp.patch("/me", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  const body: Partial<any>= await c.req.json();
  const profile = await userDb.updateProfile(sb, user?.id, body);
  return c.json(profile, 200);
});



//kod som funkar ihop med index.ts och auth.ts ok registrering och login
// === src/routes/auth.ts ===
/*rt { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { registerValidator } from "../validators/authValidators.js";
import { requireAuth } from "../middlewares/auth.js";
import * as userDb from "../database/user.js";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js";

export const authApp = new Hono();


 //POST /auth/register
 
authApp.post("/register", registerValidator, async (c) => {
  const { email, password } = await c.req.json();

  const sb = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return []; },
      setAll() {}
    }
  });

  const { data, error } = await sb.auth.signUp({ email, password });
  if (error || !data.user) return c.json({ error: error?.message || "Unable to register" }, 400);

  return c.json({ user: data.user }, 200);
});


 /// POST /auth/login
 
authApp.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const sb = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return []; },
      setAll(cookiesToSet) {
        // Låt Supabase sätta cookies korrekt
        cookiesToSet.forEach(({ name, value, options }) => {
          c.header("Set-Cookie", `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${options?.maxAge ?? 3600}`);
        });
      }
    }
  });

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.session) return c.json({ error: "Invalid credentials" }, 400);

  return c.json({ user: data.user }, 200);
});


 // POST /auth/logout
 
authApp.post("/logout", async (c) => {
  const sb = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll() { return []; }, setAll() { return; } }
  });
  await sb.auth.signOut();
  return c.json({ message: "Successfully logged out" }, 200);
});


 //GET /auth/me
 
authApp.get("/me", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  const profile = await userDb.getProfile(sb, user.id);
  return c.json(profile, 200);
});


  //PATCH /auth/me
 
authApp.patch("/me", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user")!;
  const body: Partial<any> = await c.req.json();
  const profile = await userDb.updateProfile(sb, user.id, body);
  return c.json(profile, 200);
});
*/



/*import { Hono } from "hono";
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
});*/



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
