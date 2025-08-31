import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import usePageMeta from '../hooks/usePageMeta'
import apiClient from '../api'
import FlashMessage from '../components/FlashMessage'
import Icon from '../components/Icon'

const Login = () => {
  usePageMeta({ title: 'Login' })
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()

  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [flash, setFlash] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFlashClose = () => {
    if (flash.type === 'success') navigate('/')
    setFlash({ message: '', type: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFlash({ message: '', type: '' })
    setLoading(true)

    if (!formData.username && !formData.email) {
      setFlash({ message: 'Please enter either username or email.', type: 'error' })
      setLoading(false)
      return
    }

    const payload = { password: formData.password }
    if (formData.username) payload.username = formData.username
    else payload.email = formData.email

    try {
      // Make login request without storing unused response
      await apiClient.post('/auth/login/', payload, {
        withCredentials: true,
      })

      // Login successful - cookies are set automatically
      setIsAuthenticated(true)

      setFlash({
        message: `Welcome back, ${formData.username || formData.email}!`,
        type: 'success',
      })
    } catch (err) {
      if (err.response && err.response.data) {
        const formattedError = Object.values(err.response.data)
          .map((value) => (Array.isArray(value) ? value.join(', ') : value))
          .join(' ')
        setFlash({ message: formattedError || 'Invalid login credentials.', type: 'error' })
      } else {
        setFlash({ message: 'Something went wrong. Please try again.', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }
  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: false,
      autocomplete: 'username',
    },
    { name: 'email', label: 'Email', type: 'email', required: false, autocomplete: 'email' },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      autocomplete: 'current-password',
    },
  ]

  return (
    <>
      <FlashMessage message={flash.message} type={flash.type} onClose={handleFlashClose} />
      <form
        onSubmit={handleSubmit}
        className="bg-surface-1 mx-auto mt-10 flex max-w-md flex-col gap-4 rounded p-6 shadow-md"
      >
        <h1 className="mb-4 text-center text-xl font-semibold">Login</h1>
        {formFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autocomplete}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              required={field.required}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center rounded bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Icon name="spinner" className="mr-2 h-5 w-5 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </>
  )
}

export default Login
