import React from 'react'

/**
 * IMPROVED: This function is now more robust and provides a consistent
 * number of page buttons, preventing the UI from "jumping" in size.
 */
const getPaginationRange = (totalPages, currentPage) => {
  // If there are 7 or fewer pages, show all of them without ellipses.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is near the beginning
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }

  // If the current page is near the end
  if (currentPage > totalPages - 4) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is in the middle
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export const Pagination = ({ currentPage, totalPages, totalCount, pageSize, onPageChange }) => {
  const pageNumbers = getPaginationRange(totalPages, currentPage)

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-sm text-gray-700">
        Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
        <span className="font-semibold">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> Results
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {pageNumbers.map((page, index) =>
          page === '...' ? (
            // Using a more specific key for the ellipsis
            <span key={`dots-${index}`} className="px-3 py-2">
              ...
            </span>
          ) : (
            <button
              // Using the page number itself as the key is more stable
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-lg px-4 py-2 text-sm ${
                currentPage === page ? 'bg-blue-500 text-white' : 'border hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
