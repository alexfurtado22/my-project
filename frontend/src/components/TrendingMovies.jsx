import { useEffect, useState } from 'react'

// --- Constants ---
const API_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const API_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY

// --- API Fetching Function ---
const fetchTrendingMovies = async (signal) => {
  if (!API_ACCESS_TOKEN) throw new Error('TMDB Access Token is missing!')
  const url = `${API_BASE_URL}/trending/movie/day?language=en-US&page=1`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
    signal, // Pass the signal to the fetch request
  })
  if (!res.ok) throw new Error('Failed to fetch trending movies')
  const data = await res.json()
  return data.results.slice(0, 5) // Return only the top 5
}

const TrendingMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // NEW: State for user-facing errors

  useEffect(() => {
    // NEW: AbortController for cleanup
    const controller = new AbortController()

    const loadTrending = async () => {
      try {
        setLoading(true)
        setError(null)
        const results = await fetchTrendingMovies(controller.signal)
        setMovies(results)
      } catch (err) {
        // Don't set an error if the request was intentionally aborted
        if (err.name !== 'AbortError') {
          console.error(err)
          setError(err) // NEW: Set the error state for the UI
        }
      } finally {
        setLoading(false)
      }
    }

    loadTrending()

    // NEW: Cleanup function to abort the fetch on unmount
    return () => {
      controller.abort()
    }
  }, [])

  if (loading) return <p className="text-center text-gray-500">Loading trending movies...</p>

  // NEW: Render an error message if something went wrong
  if (error) return <p className="text-center text-red-500">Could not load trending movies.</p>

  return (
    <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 max-lg:grid-cols-1">
      <h2 className="col-span-full mb-2 text-lg font-bold">🔥 Trending Movies</h2>

      {movies.map((movie) => (
        <div
          key={movie.id}
          className="group bg-surface-1/10 border-surface-shadow/20 shadow-surface-shadow row-span-2 grid h-full cursor-pointer grid-rows-subgrid items-start justify-center rounded-3xl border p-4 text-center shadow-md backdrop-blur-lg transition-transform duration-300 hover:scale-105"
          onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')}
        >
          {/* Poster */}
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="rounded object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-gray-700 text-sm text-gray-400">
              No Image
            </div>
          )}

          {/* Title */}
          <p className="text-brand text-fluid-00 mt-2 font-bold">{movie.title}</p>
        </div>
      ))}
    </div>
  )
}

export default TrendingMovies
