// src/middleware/auth.ts
import type { Context, Next } from "hono";
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
