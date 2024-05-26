import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";

const whitelist = ["/signin", "/api/auth/signin", "/api/auth/callback"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  if (whitelist.includes(new URL(context.request.url).pathname)) {
    return next();
  }
  const user = await supabase.from("users").select("*").single();

  if (!user.data) {
    return context.redirect("/signin", 302);
  }

  return next();
});