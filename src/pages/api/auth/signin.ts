import type { Provider } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const url = new URL(request.url)
  const provider = formData.get("provider")?.toString();

  const { data, error } = await supabase(cookies).auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${url.origin}/api/auth/callback`
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return redirect(data.url);
};