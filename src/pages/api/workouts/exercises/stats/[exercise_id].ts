import type { APIRoute } from "astro";
import { supabase } from "../../../../../lib/supabase";

export const GET: APIRoute = async ({ params, cookies }) => {
  const { exercise_id } = params;

  if (!exercise_id) {
    return new Response(JSON.stringify({ error: "exercise_id is required" }), { status: 400 });
  }

  const supabaseClient = supabase(cookies)

  const lastRepetitionsByExercise = await supabaseClient
    .from("workouts_repetitions")
    .select("*")
    .eq("exercise_id", exercise_id)
    .order("created_at", { ascending: false })

  const averageRepetitionsByExercise = await supabaseClient.rpc("get_avg_weight_reps_by_order", { exercise_id_param: exercise_id })

  console.log(averageRepetitionsByExercise)
  return new Response(JSON.stringify({ lastRepetitionsByExercise, averageRepetitionsByExercise }), { status: 200 });
}