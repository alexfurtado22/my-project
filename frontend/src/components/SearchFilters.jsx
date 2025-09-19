import React from 'react'
import PropTypes from 'prop-types' // 1. Import PropTypes

const branches = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT']

// 2. Receive 'queryParams' to control the input values
export const SearchFilters = ({ queryParams, setQueryParams }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setQueryParams((prev) => ({ ...prev, [name]: value }))
  }

  // 3. Add a handler to clear the filters
  const handleClear = () => {
    setQueryParams({ search: '', branch: '' })
  }

  return (
    <div className="mb-6 rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <input
          type="text"
          name="search"
          placeholder="Search by name, ID..."
          // 4. Bind the input's value to the state
          value={queryParams.search}
          onChange={handleInputChange}
          className="w-full flex-1 rounded-lg border px-4 py-2"
        />
        <select
          name="branch"
          // 5. Bind the select's value to the state
          value={queryParams.branch}
          onChange={handleInputChange}
          className="w-full rounded-lg border px-4 py-2 md:w-auto"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        {/* 6. Add the Clear button */}
        <button
          onClick={handleClear}
          className="w-full rounded-lg border bg-gray-100 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-200 md:w-auto"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

// 7. Add prop validation for robustness
SearchFilters.propTypes = {
  queryParams: PropTypes.shape({
    search: PropTypes.string,
    branch: PropTypes.string,
  }).isRequired,
  setQueryParams: PropTypes.func.isRequired,
}
