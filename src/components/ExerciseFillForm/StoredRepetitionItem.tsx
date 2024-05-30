import { useEffect, useState, type TargetedEvent } from "preact/compat";
import type { Tables } from "../../types/database";
import Minus from "../ui/icons/Minus";
import Plus from "../ui/icons/Plus";
import Spinner from "../ui/icons/Spinner";
import Trash from "../ui/icons/Trash";

interface StoredRepetitionItemProps {
  exercise: Tables<"exercises">,
  repetition: Tables<"workouts_repetitions">,
  updateRepetition: (repetition: Tables<"workouts_repetitions">) => void
  removeRepetition: (repetition: Tables<"workouts_repetitions">) => void
}
export default function StoredRepetitionItem({ exercise, repetition, updateRepetition, removeRepetition }: StoredRepetitionItemProps) {
  const [formDisabled, setFormDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [weight, setWeight] = useState(repetition.weight)
  const [repetitions, setRepetitions] = useState(repetition.repetitions)

  const decrement = (key: "weight" | "repetitions") => {
    if (key === "weight") {
      setWeight(prev => prev - 1)
    } else {
      setRepetitions(prev => prev - 1)
    }
  }

  const increment = (key: "weight" | "repetitions") => {
    if (key === "weight") {
      setWeight(prev => prev + 1)
    } else {
      setRepetitions(prev => prev + 1)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/workouts/repetitions/${exercise.id}/delete`, {
      method: "POST",
      body: JSON.stringify({ id: repetition.id }),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      removeRepetition(repetition)
      console.log(data)
    } else {
      console.error(data)
    }
  }

  const handleSubmit = async (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget).entries())
    const weight = Number(values.weight)
    const repetitions = Number(values.repetitions)
    setLoading(true)
    const res = await fetch(`/api/workouts/repetitions/${exercise.id}/update`, {
      method: "POST",
      body: JSON.stringify({ weight, repetitions, id: repetition.id }),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      updateRepetition(data)
      console.log(data)
    } else {
      console.error(data)
    }
  }

  useEffect(() => {
    const isDissabled = weight < 1 || repetitions < 1 || (weight === repetition.weight && repetitions === repetition.repetitions)
    setFormDisabled(isDissabled)
  }, [weight, repetitions, repetition.weight, repetition.repetitions])

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col items-start justify-between w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <p
        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Serie #{repetition.order}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">Peso (kg):
          <div className="relative flex items-center">
            <button
              disabled={weight < 2}
              type="button"
              onClick={() => decrement("weight")}
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none disabled:cursor-not-allowed"
            >
              <Minus />
            </button>
            <input
              type="text"
              name="weight"
              value={String(weight)}
              className="pointer-events-none bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => increment("weight")}
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
              <Plus />
            </button>
          </div>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">Repeticiones:
          <div className="relative flex items-center">
            <button
              type="button"
              disabled={repetitions < 2}
              onClick={() => decrement("repetitions")}
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none disabled:cursor-not-allowed"
            >
              <Minus />
            </button>
            <input
              type="text"
              name="repetitions"
              value={String(repetitions)}
              className="pointer-events-none bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => increment("repetitions")}
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
              <Plus />
            </button>
          </div>
        </label>
      </div>
      <div className="flex gap-4 w-full items-end">
        <button
          type="submit"
          disabled={formDisabled || loading}
          className="mt-4 flex-1 w-full h-11 transition-colors text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700 disabled:dark:bg-gray-700 disabled:dark:text-gray-300"
        >
          {!loading
            ? "Actualizar"
            : (
              <div className="inline-flex justify-center items-center">
                <Spinner size="md" />
                Cargando...
              </div>
            )
          }
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="m-0.5 transition-colors flex justify-center items-center text-red-700 size-10 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        >
          <Trash />
        </button>
      </div>
    </form>
  )
}