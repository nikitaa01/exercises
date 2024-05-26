import type { Tables } from "../types/database";

export default function ExerciseFillForm({ exercise }: { exercise: Tables<"exercises"> }) {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {exercise.name}
    </div>
  )
}