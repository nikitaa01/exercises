import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";
import type { Tables } from "../../../../types/database";

export const POST: APIRoute = async ({ params, cookies, request }) => {
  const { exercise_id } = params;

  if (!exercise_id) {
    return new Response(JSON.stringify({ error: "exercise_id is required" }), { status: 400 });
  }

  const supabaseClient = supabase(cookies)

  const body = await request.json()

  if (!body.repetitions || !body.weight) {
    return new Response(JSON.stringify({ error: "repetitions and weight are required" }), { status: 400 });
  }

  const { repetitions, weight } = body

  const orderRes = await supabaseClient
    .from("workouts_repetitions")
    .select("order, workouts(*)")
    .limit(1)
    .eq("workouts.completed", false)
    .eq("exercise_id", exercise_id)
    .order("order", { ascending: false })
    .single()

  const order = (orderRes?.data?.order ? orderRes.data.order + 1 : 1)

  let currentWorkout: Partial<Tables<"workouts">> | null = null
  if (order === 1) {
    const currentWorkoutRes = await supabaseClient
      .from("workouts")
      .select("id")
      .limit(1)
      .eq("completed", false)
      .maybeSingle();

    if (!currentWorkoutRes) {
      return new Response(JSON.stringify({ error: "No active workout" }), { status: 400 });
    }
    currentWorkout = currentWorkoutRes.data
  } else {
    currentWorkout = orderRes?.data?.workouts ?? null
  }

  if (!currentWorkout?.id) {
    return new Response(JSON.stringify({ error: "No active workout" }), { status: 400 });
  }

  const { data, error } = await supabaseClient
    .from("workouts_repetitions")
    .insert({ exercise_id, repetitions, weight, workout_id: currentWorkout.id, order })
    .select("*")
    .single()

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export const GET: APIRoute = async ({ params, cookies }) => {
  const { exercise_id } = params;

  if (!exercise_id) {
    return new Response(JSON.stringify({ error: "exercise_id is required" }), { status: 400 });
  }

  const supabaseClient = supabase(cookies)

  const { data } = await supabaseClient
    .from("workouts_repetitions")
    .select("*, workouts(completed)")
    .eq("workouts.completed", false)
    .eq("exercise_id", exercise_id)
    .order("order", { ascending: true })

  return new Response(JSON.stringify(data ?? []), { status: 200 });
}