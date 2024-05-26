import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const PATCH: APIRoute = async () => {
  const { data } = await supabase
    .from('workouts')
    .update({ completed: true })
    .eq('completed', false)
    .select("completed")
    .maybeSingle();

  if (!data?.completed) {
    return new Response(JSON.stringify({ error: 'Failed to update workout' }), { status: 400 });
  }
  return new Response(JSON.stringify({ message: 'Workout updated' }), { status: 200 });
};