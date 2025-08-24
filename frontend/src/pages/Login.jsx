import usePageMeta from '../hooks/usePageMeta'

const Login = () => {
  usePageMeta({
    title: 'Login - React + Django App',
    description: 'Login page for the React 19 + Django REST Framework project.',
    keywords: 'React, Django, DRF, Login, authentication',
    author: 'Alex Furtado',
  })

  return (
    <div className="col-span-2">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <p>Enter your credentials to access the project features.</p>
    </div>
  )
}

export default Login
