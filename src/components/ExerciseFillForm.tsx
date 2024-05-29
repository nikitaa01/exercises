import { useState, type TargetedEvent } from "preact/compat";
import type { Tables } from "../types/database";

export default function ExerciseFillForm({ exercise, defaultRepetitions }: { exercise: Tables<"exercises">, defaultRepetitions: Tables<"workouts_repetitions">[] }) {
  const [repetitions, setRepetitions] = useState<Tables<"workouts_repetitions">[]>(defaultRepetitions)
  const [activeRepetition, setActiveRepetition] = useState<string | null>(null)

  const addRepetition = (repetition: Tables<"workouts_repetitions">) => {
    setRepetitions(prev => [repetition, ...prev])
  }

  return (
    <section
      className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] place-content-center gap-8 p-8"
    >
      <CurrentRepetitionItem exercise={exercise} index={repetitions.length} active={activeRepetition === null} lastRepetition={repetitions.at(-1)} setActive={setActiveRepetition} addRepetition={addRepetition} />
      {repetitions.map((repetition) => (
        <StoredRepetitionItem key={repetition.id} exercise={exercise} repetition={repetition} active={activeRepetition === repetition.id} setActive={setActiveRepetition} />
      ))}
    </section>
  )
}

interface CurrentRepetitionItemProps {
  exercise: Tables<"exercises">,
  index: number,
  active: boolean,
  lastRepetition?: Tables<"workouts_repetitions">,
  setActive: (id: null) => void
  addRepetition: (repetition: Tables<"workouts_repetitions">) => void
}
// TODO: Switch to this inputs: https://flowbite.com/docs/forms/number-input/#control-buttons
const CurrentRepetitionItem = ({ exercise, active, setActive, index, lastRepetition, addRepetition }: CurrentRepetitionItemProps) => {
  const [formDisabled, setFormDisabled] = useState(!lastRepetition)

  const handleFormClick = (e: TargetedEvent<HTMLFormElement, Event>) => {
    setActive(null)
  }

  const handleSubmit = async (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()
    if (formDisabled) return // TODO: Display an error message
    const values = Object.fromEntries(new FormData(e.currentTarget).entries())
    const weight = Number(values.weight)
    const repetitions = Number(values.repetitions)

    const res = await fetch(`/api/workouts/repetitions/${exercise.id}`, {
      method: "POST",
      body: JSON.stringify({ weight, repetitions }),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    if (res.ok) {
      console.log(data)
      addRepetition(data)
    } else {
      console.error(data)
    }
  }

  const handleChange = (e: TargetedEvent<HTMLFormElement, Event>) => {
    const values = Object.fromEntries(new FormData(e.currentTarget).entries())
    const weight = Number(values.weight)
    const repetitions = Number(values.repetitions)
    if (weight < 1 || repetitions < 1) {
      setFormDisabled(true)
    } else {
      setFormDisabled(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onClick={handleFormClick}
      onChange={handleChange}
      className="relative flex flex-col items-start justify-between w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div
        className={`absolute top-0 left-0 z-10 w-full h-full bg-opacity-50 pointer-events-none transition-colors ${active ? "" : "bg-gray-800 "}`}
      />
      <p
        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Serie #{index + 1}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">Peso (kg):
          <input
            type="number"
            name="weight"
            defaultValue={String(lastRepetition?.weight ?? 0)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">Repeticiones:
          <input
            type="number"
            name="repetitions"
            defaultValue={String(lastRepetition?.repetitions ?? 0)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={formDisabled}
        className="mt-4 w-full transition-colors text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700 disabled:dark:bg-gray-700 disabled:dark:text-gray-300"
      >
        Guardar
      </button>
    </form>
  )
}

interface StoredRepetitionItemProps {
  exercise: Tables<"exercises">,
  repetition: Tables<"workouts_repetitions">,
  active: boolean,
  setActive: (id: string) => void
}
// TODO: Switch to this inputs: https://flowbite.com/docs/forms/number-input/#control-buttons
const StoredRepetitionItem = ({ exercise, repetition, active, setActive }: StoredRepetitionItemProps) => {
  const [formDisabled, setFormDisabled] = useState(true)

  const handleFormClick = (e: TargetedEvent<HTMLFormElement, Event>) => {
    setActive(repetition.id)
  }

  const handleChange = (e: TargetedEvent<HTMLFormElement, Event>) => {
    const values = Object.fromEntries(new FormData(e.currentTarget).entries())
    const weight = Number(values.weight)
    const repetitions = Number(values.repetitions)
    if (weight === repetition.weight && repetitions === repetition.repetitions) {
      setFormDisabled(true)
    } else {
      setFormDisabled(false)
    }
  }

  return (
    <form
      onClick={handleFormClick}
      onChange={handleChange}
      className="relative flex flex-col items-start justify-between w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div
        className={`absolute top-0 left-0 z-10 w-full h-full bg-opacity-50 pointer-events-none transition-colors ${active ? "" : "bg-gray-800 "}`}
      />
      <p
        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Serie #{repetition.order}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">Peso (kg):
          <input
            type="number"
            name="weight"
            defaultValue={String(repetition.weight)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">Repeticiones:
          <input
            type="number"
            name="repetitions"
            defaultValue={String(repetition.repetitions)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={formDisabled || true} /* TODO: Develop this feat */
        className="mt-4 w-full transition-colors text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700 disabled:dark:bg-gray-700 disabled:dark:text-gray-300"
      >
        Actualizar
      </button>
    </form>
  )
}