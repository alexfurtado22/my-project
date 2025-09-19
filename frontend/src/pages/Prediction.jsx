import React, { useState, useCallback, memo } from 'react'

const popularTickers = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA']

// ✅ Memoized result card
const ResultCard = memo(({ data }) => {
  if (!data) return null
  return (
    <div className="rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-2 text-xl font-semibold">{data.company_name}</h2>
      <p>
        <strong>Ticker:</strong> {data.ticker}
      </p>
      <p>
        <strong>Last Close:</strong> ${data.last_close_price} ({data.last_close_date})
      </p>
      <p>
        <strong>Prediction:</strong> ${data.predicted_price} on {data.prediction_date}
      </p>
    </div>
  )
})

const Prediction = () => {
  const [ticker, setTicker] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const fetchPrediction = useCallback(
    async (selectedTicker) => {
      const t = selectedTicker || ticker
      if (!t) return
      setLoading(true)
      setError(null)
      setData(null)

      try {
        const response = await fetch(`${API_BASE_URL}/predict/?ticker=${t}`)
        const result = await response.json()
        if (response.ok) setData(result)
        else setError(result.error || 'Failed to fetch prediction')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [ticker]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') fetchPrediction()
    },
    [fetchPrediction]
  )

  return (
    <div className="holder mx-auto max-w-xl py-10">
      <h1 className="mb-6 text-center text-2xl font-bold">📈 Stock Prediction</h1>

      {/* Popular ticker buttons */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {popularTickers.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTicker(t)
              fetchPrediction(t)
            }}
            className="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Input + Predict button */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Type a ticker (e.g., AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-lg border p-2"
        />
        <button
          onClick={() => fetchPrediction()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Predict
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Memoized result card */}
      {data && !error && <ResultCard data={data} />}
    </div>
  )
}

export default Prediction
