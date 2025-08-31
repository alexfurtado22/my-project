import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with every request
})

// Add CSRF token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Skip for GET/HEAD/OPTIONS requests or if already has CSRF header
    if (
      ['get', 'head', 'options'].includes(config.method?.toLowerCase()) ||
      config.headers['X-CSRFToken']
    ) {
      return config
    }

    // Get CSRF token from cookie
    const csrfToken = getCookie('csrftoken')
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

export default apiClient
