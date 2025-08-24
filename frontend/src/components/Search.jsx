import Icon from './Icon'

const Search = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (e) => setSearchTerm(e.target.value)

  return (
    <div className="relative flex w-full max-w-xs items-center">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400">
        <Icon name="search" className="h-5 w-5" />
      </div>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
        className="bg-surface-2 focus:border-brand focus:ring-brand border-brand w-full rounded-lg border py-2 pr-3 pl-9 text-sm focus:ring-2"
        autoComplete="off"
      />
    </div>
  )
}

export default Search
