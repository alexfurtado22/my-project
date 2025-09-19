// src/components/Header.jsx
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import apiClient from '../api'
import Icon from './Icon'
import Search from './Search'

const Header = ({ theme, setTheme, setSearchTerm, searchTerm }) => {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated } = useAuth()

  const guestLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/login', label: 'Login' },
    { path: '/signup', label: 'Sign Up' },
  ]

  const authLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/stock', label: 'Stock' },
    { path: '/prediction', label: 'Prediction' },
    { path: '/about', label: 'About' },
  ]

  const navLinks = isAuthenticated ? authLinks : guestLinks

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout/')
    } catch (error) {
      // Ignore 401 - it's expected after successful logout
      if (error.response?.status !== 401) {
        console.error('Logout error:', error)
      }
    } finally {
      setIsAuthenticated(false)
      navigate('/login')
    }
  }

  // ... rest of your JSX remains unchanged
  return (
    <header className="bg-surface-1 col-span-2 flex items-center justify-between px-6 py-4 max-md:flex-col max-md:gap-4">
      {/* Logo + Navigation */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="focus:ring-brand/20 inline-flex items-center justify-center rounded p-1 transition duration-300 focus:ring-2 focus:outline-none"
          aria-label="Go to homepage"
        >
          <Icon name="analytics" className="size-6" />
        </Link>
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm transition duration-300 hover:underline ${
                  isActive ? 'text-brand font-bold' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-sm transition duration-300 hover:underline"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Search */}
      <div>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Theme selector */}
      <div className="flex items-center gap-4 max-sm:flex-col">
        <label htmlFor="theme-switcher" className="text-sm">
          Select theme:
        </label>
        <select
          id="theme-switcher"
          aria-label="Select color theme"
          className="bg-surface-2 border-surface-3 h-fit w-fit rounded-full border text-xs focus:ring-0 focus:outline-none"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light ☀️</option>
          <option value="dark">Dark 🌙</option>
          <option value="lime">Lime 🌿</option>
          <option value="blue">Blue 🌊</option>
          <option value="dim">Dim 🌫️</option>
          <option value="grape">Grape 🍇</option>
          <option value="choco">Choco 🍫</option>
          <option value="auto">Auto 🖥️</option>
        </select>
      </div>
    </header>
  )
}

export default Header
