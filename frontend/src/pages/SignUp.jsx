// src/pages/SignUp.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import { useAuth } from '../context/auth-context'
import apiClient from '../api'
import FlashMessage from '../components/FlashMessage'
import Icon from '../components/Icon'

const SignUp = () => {
  usePageMeta({ title: 'Sign Up' })
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  })

  const [flash, setFlash] = useState({ message: '', type: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }))
  }

  const handleFlashClose = () => {
    if (flash.type === 'success') {
      navigate('/')
    }
    setFlash({ message: '', type: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setFlash({ message: '', type: '' })
    setLoading(true)

    if (formData.password1 !== formData.password2) {
      setFieldErrors({ password2: ['Passwords do not match.'] })
      setLoading(false)
      return
    }

    try {
      // KEY CHANGE: Remove localStorage and let cookies handle authentication
      await apiClient.post('/auth/registration/', formData)

      // Registration successful - HttpOnly cookies are now set automatically
      setIsAuthenticated(true)

      setFlash({
        message: `Registration successful! Welcome, ${formData.username}!`,
        type: 'success',
      })
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data
        if (errorData.non_field_errors) {
          setFlash({ message: errorData.non_field_errors[0], type: 'error' })
        }
        setFieldErrors(errorData)
      } else {
        setFlash({ message: 'Something went wrong. Please try again.', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  const formFieldsConfig = [
    { name: 'username', type: 'text', label: 'Username', autocomplete: 'username' },
    { name: 'email', type: 'email', label: 'Email', autocomplete: 'email' },
    { name: 'password1', type: 'password', label: 'Password', autocomplete: 'new-password' },
    {
      name: 'password2',
      type: 'password',
      label: 'Confirm Password',
      autocomplete: 'new-password',
    },
  ]

  return (
    <>
      <FlashMessage message={flash.message} type={flash.type} onClose={handleFlashClose} />
      <div className="bg-surface-1 mx-auto mt-10 max-w-md rounded-lg p-6 shadow-md">
        <h1 className="mb-4 text-center text-xl font-semibold">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formFieldsConfig.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-1 block text-sm">
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
                required
                disabled={loading}
              />
              {fieldErrors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors[field.name][0]}</p>
              )}
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
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
      </div>
    </>
  )
}

export default SignUp
