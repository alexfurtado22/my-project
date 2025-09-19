// frontend/src/pages/StockView.jsx

import React, { useState } from 'react'
import apiClient from '../api'
import usePageMeta from '../hooks/usePageMeta'

const StockView = () => {
  usePageMeta({
    title: 'Stock Price Prediction',
    description: 'Enter a stock ticker to generate an LSTM-based price prediction plot.',
    keywords: 'stock prediction, LSTM, machine learning, finance',
  })

  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // <-- store backend response

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const response = await apiClient.post('/predict-stock/', { ticker })
      setResult(response.data)
    } catch (err) {
      console.error('API Error:', err)
      const errorMessage = err.response?.data?.error || 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Stock Price Prediction</h1>
      <p>
        Enter a stock ticker symbol (e.g., AAPL, MSFT) to generate prediction plots and metrics.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ margin: '2rem 0' }}>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter Ticker Symbol"
          style={{ padding: '0.5rem', fontSize: '1rem', width: '200px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginLeft: '10px' }}
        >
          {loading ? 'Generating...' : 'Generate Plots'}
        </button>
      </form>

      {/* Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Results */}
      <div id="plot-container" style={{ marginTop: '2rem' }}>
        {loading && <p>Model is running, please wait...</p>}

        {/* Metrics */}
        {result?.metrics && (
          <div style={{ marginBottom: '2rem' }}>
            <h2>📊 Model Evaluation</h2>
            <p>
              <strong>MSE:</strong> {result.metrics.mse}
            </p>
            <p>
              <strong>RMSE:</strong> {result.metrics.rmse}
            </p>
            <p>
              <strong>R²:</strong> {result.metrics.r2}
            </p>
          </div>
        )}

        {/* Plots */}
        {result?.plots && (
          <div>
            <h2>📈 Generated Plots</h2>
            {Object.entries(result.plots).map(([key, url]) => (
              <div key={key} style={{ marginBottom: '2rem' }}>
                <h3>{key.replace(/_/g, ' ').replace('url', '')}</h3>
                <img
                  src={url}
                  alt={key}
                  className="mt-4 w-full max-w-[800px] border border-gray-300"
                />
              </div>
            ))}
          </div>
        )}

        {!loading && !result && !error && (
          <p>Your plots and metrics will appear here once generated.</p>
        )}
      </div>
    </div>
  )
}

export default StockView
