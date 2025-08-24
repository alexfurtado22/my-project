import usePageMeta from '../hooks/usePageMeta'

const About = () => {
  usePageMeta({
    title: 'About - React + Django App',
    description: 'Learn more about the React 19 + Django REST Framework project.',
    keywords: 'React, Django, DRF, About, project',
    author: 'Alex Furtado',
  })

  return (
    <div className="col-span-2">
      <h1 className="mb-4 text-2xl font-bold">About This Project</h1>
      <p>
        This project demonstrates how to integrate React 19 with Django REST Framework. You can
        browse trending movies and fetch data dynamically from the API.
      </p>
    </div>
  )
}

export default About
