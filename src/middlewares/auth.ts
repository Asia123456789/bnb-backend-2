// src/middlewares/auth.ts
import type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";

import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js";

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    user: User | null;
  }
}

function createSupabaseForRequest(c: Context) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        );
      },
      setAll(cookiesToSet: { name: string; value: string; options?: { maxAge?: number } }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
             ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: options?.maxAge && options.maxAge > 34560000 ? 34560000 : options?.maxAge,
          });
        });
      },
    },
  });
}

async function withSupabase(c: Context) {
  if (!c.get("supabase")) {
    const sb = createSupabaseForRequest(c);
    c.set("supabase", sb);

    const {
      data: { user },
      error,
    } = await sb.auth.getUser();

    // Om JWT har gått ut, försök att refresha session
    if (error && error.code === "session_expired") {
      const { data: refreshData, error: refreshError } = await sb.auth.refreshSession();

      c.set("user", !refreshError && refreshData.user ? refreshData.user : null);
    } else {
      console.log("withSupabase setting user:", typeof user);
      c.set("user", error ? null : user);
    }
  }
}

// Middleware för routes där auth är valfri
export async function optionalAuth(c: Context, next: Next) {
  await withSupabase(c);
  return next();
}

// Middleware för routes där auth krävs
export async function requireAuth(c: Context, next: Next) {
  await withSupabase(c);

  const user = c.get("user");
  console.log("requireAuth user:", typeof user);
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return next();
}



//den riktiga imports
//kod som funkar ihop med index.ts och auth.ts ok registrering och login
// src/middlewares/auth.ts
/*port type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js";*/
//kod som fungerar med login och register i auth.ts och index.ts
// src/middlewares/auth.ts
/*port type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import {
  createServerClient,
  parseCookieHeader,
  type Cookie,
} from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js";

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    user: User | null;
  }
}

// Skapa Supabase-serverklient med cookies
function createSupabaseForRequest(c: Context) {
  const cookies = parseCookieHeader(c.req.header("Cookie") ?? "");

  // Mappa cookies till Supabase-namn
  const mapped = cookies.map(({ name, value }) => {
    if (name === `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token`) return { name, value };
    if (name === `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token-refresh`) return { name, value };
    return { name, value };
  });

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return mapped;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: false, // Lokalt: false, produktion: true
            sameSite: "lax",
            path: "/",
          });
        });
      },
    },
  });
}

// Middleware: lägg Supabase-klient + user i context
async function withSupabase(c: Context, next: Next) {
  if (!c.get("supabase")) {
    const sb = createSupabaseForRequest(c);
    c.set("supabase", sb);

    const { data: { user }, error } = await sb.auth.getUser();
    c.set("user", error ? null : user ?? null);
  }
  return next();
}

// Optional auth
export async function optionalAuth(c: Context, next: Next) {
  return withSupabase(c, next);
}

// Require auth
export async function requireAuth(c: Context, next: Next) {
  await withSupabase(c, async () => {});
  const user = c.get("user");
  if (!user) throw new HTTPException(401, { message: "Unauthorized" });
  return next();
}*/



//?
// src/middleware/auth.ts
/*import type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase";
import { HTTPException } from "hono/http-exception";

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    user: User | null;
  }
}

// Skapar Supabase-klienten per request, med cookies
function createSupabaseForRequest(c: Context) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        );
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        });
      },
    },
  });
}

// Middleware för att sätta supabase och user i context
async function withSupabase(c: Context, next: Next) {
  if (!c.get("supabase")) {
    const sb = createSupabaseForRequest(c);
    c.set("supabase", sb);

    const { data: { user }, error } = await sb.auth.getUser();

    // ⚡ Om JWT är expired försöker vi refresh
    if (error && error.code === "session_expired") {
      console.log("⚠️ Session expired, försöker refresh");
      const { data: refreshData, error: refreshError } = await sb.auth.refreshSession();
      if (!refreshError && refreshData.user) {
        c.set("user", refreshData.user);
      } else {
        c.set("user", null);
      }
    } else {
      c.set("user", error ? null : user);
    }
  }
  return next();
}

// Middleware som alltid körs men auth är optional
export async function optionalAuth(c: Context, next: Next) {
  return withSupabase(c, next);
}

// Middleware som kräver inloggad användare
export async function requireAuth(c: Context, next: Next) {
  await withSupabase(c, async () => {});
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return next();
}
*/


// src/middleware/auth.ts
/*import type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase";
import { HTTPException } from "hono/http-exception";

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    user: User | null;
  }
}

interface Cookie {
  name: string;
  value: string;
  options?: Record<string, any>;
}

function createSupabaseForRequest(c: Context) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        );
      },
      setAll(cookiesToSet: Cookie[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        });
      },
    },
  });
}

export async function withSupabase(c: Context, next: Next) {
  if (!c.get("supabase")) {
    const sb = createSupabaseForRequest(c);
    c.set("supabase", sb);

    const { data: { user }, error } = await sb.auth.getUser();
    c.set("user", error ? null : user);
  }
  return next();
}

export async function optionalAuth(c: Context, next: Next) {
  return withSupabase(c, next);
}

export async function requireAuth(c: Context, next: Next) {
  await withSupabase(c, async () => {});
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return next();
}
*/