// src/components/Header.jsx
import { Link } from 'react-router-dom'
import Icon from './Icon'
import Search from './Search'

const Header = ({ theme, setTheme, setSearchTerm, searchTerm }) => {
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/login', label: 'Login' },
  ]

  return (
    <header className="bg-surface-1 col-span-2 flex items-center justify-between px-6 py-4 max-md:flex-col max-md:gap-4">
      {/* Logo + Navigation */}
      <div className="flex items-center gap-4">
        <Icon name="analytics" className="size-6" />
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="text-sm hover:underline">
              {link.label}
            </Link>
          ))}
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
