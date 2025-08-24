import MoviesList from '../components/MoviesList'
import usePageMeta from '../hooks/usePageMeta'

const Home = ({ searchTerm }) => {
  usePageMeta({
    title: 'Home - React + Django App',
    description: 'Check out trending movies using React 19 + Django REST Framework.',
    keywords: 'React, Django, DRF, movies, trending, API, Home',
    author: 'Alex Furtado',
  })

  return <MoviesList searchTerm={searchTerm} />
}

export default Home
