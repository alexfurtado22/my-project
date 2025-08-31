// src/components/FlashMessage.jsx
import { useEffect } from 'react'

const FlashMessage = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  return (
    <div className={`fixed top-4 right-4 z-50 rounded px-4 py-2 shadow ${colors[type]}`}>
      {message}
    </div>
  )
}

export default FlashMessage
