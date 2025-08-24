import { lazy, Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'

// Lazy-load pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Login = lazy(() => import('./pages/Login'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const doc = document.documentElement
    if (theme === 'auto') doc.removeAttribute('data-theme')
    else doc.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const router = createBrowserRouter([
    {
      element: (
        <AppLayout
          theme={theme}
          setTheme={setTheme}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ),
      errorElement: (
        <Suspense fallback={<div className="mt-10 text-center">Loading...</div>}>
          <ErrorPage />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={<div>Loading Home...</div>}>
              <Home searchTerm={searchTerm} />
            </Suspense>
          ),
        },
        {
          path: '/about',
          element: (
            <Suspense fallback={<div>Loading About...</div>}>
              <About />
            </Suspense>
          ),
        },
        {
          path: '/login',
          element: (
            <Suspense fallback={<div>Loading Login...</div>}>
              <Login />
            </Suspense>
          ),
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App
