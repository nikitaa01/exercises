import { createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import { type Database } from "../types/database";

export const supabase = (cookies: AstroCookies) => createServerClient<Database>(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  {
    cookies: {
      get(key) {
        return cookies.get(key)?.value
      },
      set(key, value, options) {
        cookies.set(key, value, options)
      },
      remove(key, options) {
        cookies.delete(key, options)
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);