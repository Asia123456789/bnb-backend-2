// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase not initialized. Add 'SUPABASE_URL' and 'SUPABASE_ANON_KEY' to environment variables"
  );
}

export const supabaseUrl: string = process.env.SUPABASE_URL;
export const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY;

// Optional global client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


///*Afrika1234567890.123*/
//User "minemail@gmail.com" pasword: "supersecure"
// {"id":"3740e5ee-f4b9-4a1f-bf03-adaeeb2da21e","aud":"authenticated","role":"authenticated","email":"minemail@gmail.com","phone":"","confirmation_sent_at":"2025-10-26T20:39:33.758000073Z","app_metadata":{"provider":"email","providers":["email"]},"user_metadata":{"email":"minemail@gmail.com","email_verified":false,"phone_verified":false,"sub":"3740e5ee-f4b9-4a1f-bf03-adaeeb2da21e"},"identities":[{"identity_id":"570575d2-8896-4286-9c8c-5ce8893ffcab","id":"3740e5ee-f4b9-4a1f-bf03-adaeeb2da21e","user_id":"3740e5ee-f4b9-4a1f-bf03-adaeeb2da21e","identity_data":{"email":"minemail@gmail.com","email_verified":false,"phone_verified":false,"sub":"3740e5ee-f4b9-4a1f-bf03-adaeeb2da21e"},"provider":"email","last_sign_in_at":"2025-10-26T20:39:33.753124064Z","created_at":"2025-10-26T20:39:33.753172Z","updated_at":"2025-10-26T20:39:33.753172Z","email":"minemail@gmail.com"}],"created_at":"2025-10-26T20:39:33.746961Z","updated_at":"2025-10-26T20:39:34.721148Z","is_anonymous":false}*
//User- "linda@hotmail.com" password: "linda123"
// {"id":"eea881fd-34e1-4d24-8963-9126751639f9","aud":"authenticated","role":"","email":"linda@hotmail.com","phone":"","confirmation_sent_at":"2025-10-27T10:03:15.68669427Z","app_metadata":{"provider":"email","providers":["email"]},"user_metadata":{},"identities":[],"created_at":"2025-10-27T10:03:15.68669427Z","updated_at":"2025-10-27T10:03:15.68669427Z","is_anonymous":false}*
/*
//kod funkar ihop med index.ts och auth.ts ok registrering och login
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

export const supabaseUrl = process.env.SUPABASE_URL!;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Vanlig klient (för t.ex. seed eller enkel query)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/