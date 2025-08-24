import usePageMeta from '../hooks/usePageMeta'

const ErrorPage = () => {
  usePageMeta({
    title: '404 Not Found - React + Django App',
    description: 'The page you are looking for does not exist.',
    keywords: 'React, Django, DRF, 404, error, page not found',
    author: 'Alex Furtado',
  })

  return (
    <div className="col-span-2 mt-10 text-center">
      <h1 className="text-2xl font-bold text-red-600">Oops! Page not found.</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
    </div>
  )
}

export default ErrorPage
