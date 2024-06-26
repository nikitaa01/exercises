import { useState, type TargetedEvent } from "preact/compat";
import type { Tables } from "../../types/database";
import Minus from "../ui/icons/Minus";
import Plus from "../ui/icons/Plus";
import Spinner from "../ui/icons/Spinner";

interface CurrentRepetitionItemProps {
  exercise: Tables<"exercises">,
  index: number,
  lastRepetition?: Tables<"workouts_repetitions">,
  addRepetition: (repetition: Tables<"workouts_repetitions">) => void
}
// TODO: Switch to this inputs: https://flowbite.com/docs/forms/number-input/#control-buttons
export default function CurrentRepetitionItem({ exercise, index, lastRepetition, addRepetition }: CurrentRepetitionItemProps) {
  const [loading, setLoading] = useState(false)
  const [weight, setWeight] = useState(lastRepetition?.weight ?? 1)
  const [repetitions, setRepetitions] = useState(lastRepetition?.repetitions ?? 1)

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

  const handleSubmit = async (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()
    setLoading(true)
    const values = Object.fromEntries(new FormData(e.currentTarget).entries())
    const weight = Number(values.weight)
    const repetitions = Number(values.repetitions)

    const res = await fetch(`/api/workouts/repetitions/${exercise.id}`, {
      method: "POST",
      body: JSON.stringify({ weight, repetitions }),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      console.log(data)
      addRepetition(data)
    } else {
      console.error(data)
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col items-start justify-between w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <p
        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Serie #{index + 1}
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
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full h-11 transition-colors text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700 disabled:dark:bg-gray-700 disabled:dark:text-gray-300"
      >
        {!loading
          ? "Guardar"
          : (
            <div className="inline-flex justify-center items-center">
              <Spinner size="md" />
              Cargando...
            </div>
          )
        }
      </button>
    </form>
  )
}