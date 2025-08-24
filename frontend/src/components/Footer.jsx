import { Link } from 'react-router-dom'

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/login', label: 'Login' },
  ]

  return (
    <footer className="bg-surface-3 col-span-2 py-4 text-sm text-gray-500">
      <div className="flex items-center justify-center gap-4 max-sm:flex-col">
        {/* Navigation Links */}
        <nav aria-label="Footer Navigation" className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm transition-colors duration-200 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Copyright */}
      <div className="flex justify-center text-center">
        <p>&copy; {new Date().getFullYear()} My Movie App. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
