import { useContext } from 'react'
import { AuthContext } from '../context/auth-context'

// This custom hook provides an easy way to access the authentication context.
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    // This error is thrown if the hook is used outside of a component wrapped by AuthProvider.
    // It's a good practice to prevent bugs.
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
