import type { Tables } from "../types/database";

export default function ExerciseFillForm({ exercise, lastRepetitions, averageRepetitions }: { exercise: Tables<"exercises">, lastRepetitions: any, averageRepetitions: any }) {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {exercise.name}
    </div>
  )
}