// src/context/auth-provider.jsx
import { useState, useEffect } from 'react'
import { AuthContext } from './auth-context'
import apiClient from '../api' // Import your api client

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authCheckComplete, setAuthCheckComplete] = useState(false) // Add loading state

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Ask the backend if our HttpOnly cookie is valid
        const response = await apiClient.get('/auth/user/')

        if (response.status === 200) {
          // If successful, the user is authenticated
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        // If the request fails (401, etc.), the user is not authenticated
        // We don't need the error details for this check
        setIsAuthenticated(false)
      } finally {
        setAuthCheckComplete(true) // Mark the auth check as complete
      }
    }

    checkAuthStatus()
  }, [])

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    authCheckComplete, // You might want to expose this to show loading states
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
