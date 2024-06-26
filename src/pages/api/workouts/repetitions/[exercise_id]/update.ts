import type { APIRoute } from "astro";
import { supabase } from "../../../../../lib/supabase";

export const POST: APIRoute = async ({ params, cookies, request }) => {
  const { exercise_id } = params;

  if (!exercise_id) {
    return new Response(JSON.stringify({ error: "exercise_id is required" }), { status: 400 });
  }

  const supabaseClient = supabase(cookies)

  const body = await request.json()

  if (!body.repetitions || !body.weight || !body.id) {
    return new Response(JSON.stringify({ error: "repetitions, weight and id are required" }), { status: 400 });
  }

  const { repetitions, weight, id } = body

  const { data, error } = await supabaseClient
    .from("workouts_repetitions")
    .update({ repetitions, weight })
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}