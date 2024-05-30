import { useState } from "preact/compat";
import type { Tables } from "../../types/database";
import CurrentRepetitionItem from "./CurrentRepetitionItem";
import StoredRepetitionItem from "./StoredRepetitionItem";

export default function ExerciseFillForm({ exercise, defaultRepetitions }: { exercise: Tables<"exercises">, defaultRepetitions: Tables<"workouts_repetitions">[] }) {
  const [repetitions, setRepetitions] = useState<Tables<"workouts_repetitions">[]>(defaultRepetitions)

  const addRepetition = (repetition: Tables<"workouts_repetitions">) => {
    setRepetitions(prev => [repetition, ...prev])
  }

  const updateRepetition = (repetition: Tables<"workouts_repetitions">) => {
    const index = repetitions.findIndex(r => r.id === repetition.id)
    setRepetitions(prev => {
      const newRepetitions = [...prev]
      newRepetitions[index] = repetition
      return newRepetitions
    })
  }

  return (
    <section
      className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] place-content-center gap-8 p-8"
    >
      <CurrentRepetitionItem exercise={exercise} index={repetitions.length} lastRepetition={repetitions?.[0]} addRepetition={addRepetition} />
      {repetitions.map((repetition) => (
        <StoredRepetitionItem key={repetition.id} exercise={exercise} repetition={repetition} updateRepetition={updateRepetition} />
      ))}
    </section>
  )
}