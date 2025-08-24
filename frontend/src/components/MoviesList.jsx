import { useEffect, useState } from 'react'
import TrendingMovies from './TrendingMovies'

// --- Constants ---
const API_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200'
const API_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY

// --- Custom Hook for Debouncing ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// --- API Fetching Function with Pagination ---
const fetchMovies = async (searchTerm, page = 1, signal) => {
  if (!API_ACCESS_TOKEN) throw new Error('TMDB Access Token is missing!')
  const url = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&page=${page}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
    signal,
  })
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  const data = await res.json()
  return {
    results: data.results || [],
    totalPages: data.total_pages || 0,
  }
}

// --- Helper: Rating color ---
const getRatingColor = (rating) => {
  if (rating >= 7) return 'bg-green-600'
  if (rating >= 5) return 'bg-yellow-600'
  return 'bg-red-600'
}

// --- React Component ---
const MoviesList = ({ searchTerm = '' }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchTerm) setPage(1)
  }, [debouncedSearchTerm])

  // Fetch movies
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setMovies([])
      setTotalPages(0)
      return
    }

    const controller = new AbortController()
    const loadMovies = async () => {
      setLoading(true)
      setError(null)
      try {
        const { results, totalPages } = await fetchMovies(
          debouncedSearchTerm,
          page,
          controller.signal
        )
        setMovies(results)
        setTotalPages(totalPages)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
    return () => controller.abort()
  }, [debouncedSearchTerm, page])

  // --- Conditional renders ---
  if (!searchTerm)
    return (
      <p className="flex items-center gap-2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        Type a movie name to search...
      </p>
    )

  if (loading)
    return (
      <p className="flex animate-pulse items-center gap-2 text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v4m0 8v4m8-8h-4M4 12H0"
          />
        </svg>
        Loading...
      </p>
    )

  if (error)
    return (
      <p className="flex items-center gap-2 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {error}
      </p>
    )

  if (!movies.length && debouncedSearchTerm)
    return (
      <p className="flex items-center gap-2 text-yellow-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        No movies found for "{debouncedSearchTerm}".
      </p>
    )

  // --- Pagination Controls ---
  const PaginationControls = () => (
    <div className="mb-6 flex items-center justify-center gap-4 max-sm:flex-col">
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1 || loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= totalPages || loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )

  // --- Main movie grid ---
  return (
    <>
      <div className="mb-10">
        <TrendingMovies />
      </div>
      {movies.length > 0 && <PaginationControls />}
      <div className="mb-6 grid auto-rows-auto grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 max-lg:grid-cols-1">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group bg-surface-1/10 border-surface-shadow/20 shadow-surface-shadow relative row-span-5 grid h-full cursor-pointer grid-rows-subgrid items-start justify-center rounded-3xl border p-4 text-center shadow-md backdrop-blur-lg transition-transform duration-300 hover:scale-105"
            onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')}
          >
            {/* Rating */}
            {movie.vote_average > 0 && (
              <div
                className={`absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white ${getRatingColor(
                  movie.vote_average
                )}`}
              >
                <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}

            {/* Poster */}
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="aspect-[2/3] w-full rounded object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-gray-700 text-sm text-gray-400">
                No Image
              </div>
            )}

            {/* Title */}
            <h3 className="text-brand text-fluid-1 mt-2 font-bold">{movie.title}</h3>

            {/* Release date */}
            <p className="text-sm">{movie.release_date}</p>

            {/* Overview */}
            <p className="text-fluid-0 mt-2 line-clamp-3">{movie.overview}</p>
          </div>
        ))}
      </div>
      {movies.length > 0 && totalPages > 1 && <PaginationControls />}
    </>
  )
}

export default MoviesList
