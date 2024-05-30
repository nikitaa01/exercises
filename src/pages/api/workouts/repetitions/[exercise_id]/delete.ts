import type { APIRoute } from "astro";
import { supabase } from "../../../../../lib/supabase";

export const POST: APIRoute = async ({ params, cookies, request }) => {
  const { exercise_id } = params;

  if (!exercise_id) {
    return new Response(JSON.stringify({ error: "exercise_id is required" }), { status: 400 });
  }

  const supabaseClient = supabase(cookies)

  const body = await request.json()

  if (!body.id) {
    return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });
  }

  const { id } = body

  const { data, error } = await supabaseClient
    .from("workouts_repetitions")
    .delete()
    .eq("id", id)
    .single()

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}