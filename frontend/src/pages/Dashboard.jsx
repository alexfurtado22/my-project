import React, { useState, useEffect } from 'react' // 1. Import useState
import { useStudents } from '../hooks/useStudents'
import { SearchFilters } from '../components/SearchFilters'
import { StudentTable } from '../components/StudentTable'
import { Pagination } from '../components/Pagination'
import { AddStudentModal } from '../components/AddStudentModal' // 2. Import the new modal

const Dashboard = () => {
  const {
    students,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    PAGE_SIZE,
    queryParams,
    setQueryParams,
    fetchStudents,
    handleDelete,
  } = useStudents()

  // 3. Add state to control the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Effect for debounced searching
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchStudents(1, queryParams)
    }, 500)

    return () => clearTimeout(handler)
  }, [queryParams, fetchStudents])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchStudents(newPage, queryParams)
    }
  }

  // 4. Create a handler to refresh the list after a new student is added
  const handleStudentAdded = () => {
    // Fetch the first page again to see the new record, clearing any filters
    setQueryParams({ search: '', branch: '' })
    fetchStudents(1, { search: '', branch: '' })
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">Manage your student records ({totalCount} total)</p>
        </div>
        {/* 5. Add the "Add Student" button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          + Add Student
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <SearchFilters queryParams={queryParams} setQueryParams={setQueryParams} />

      <StudentTable loading={loading} students={students} handleDelete={handleDelete} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />

      {/* 6. Render the modal component */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  )
}

export default Dashboard
