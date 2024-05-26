import { navigate } from "astro:transitions/client"
import { useState } from "preact/compat"
import Spinner from "./ui/icons/Spinner"

export default function CompleteWorkoutButton() {
    const [loading, setLoading] = useState(false)
    const handleClick = async () => {
        setLoading(true)
        const response = await fetch("/api/workouts/complete", { method: "PATCH" })
        if (response.ok) {
            navigate("/")
        } else {
            // TODO: Display toast with error message
        }
    }

    return (
        <button
            onClick={handleClick}
            type="button"
            disabled={loading}
            class="px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {
                !loading
                    ? "Completar entrenamiento"
                    : (
                        <div class="inline-flex justify-center items-center">
                            <Spinner />
                            Cargando...
                        </div>
                    )
            }
        </button>
    )
}