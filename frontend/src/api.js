import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with every request
})

// Add CSRF token and JWT token from cookies to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token from cookie to Authorization header
    const accessToken = getCookie('jwt-access-token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Skip CSRF for GET/HEAD/OPTIONS requests or if already has CSRF header
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

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Skip token refresh for logout endpoint
    if (originalRequest.url?.includes('/auth/logout/')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token using the refresh cookie
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
          {},
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )

        // The backend should set the new access token as a cookie
        // No need to manually store it since it's handled by cookies

        // Retry the original request (new cookie will be sent automatically)
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login or handle logout
        console.error('Token refresh failed:', refreshError)
        // You might want to clear cookies or redirect to login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

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
