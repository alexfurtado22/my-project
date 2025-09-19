import React from 'react'
import PropTypes from 'prop-types' // 👈 1. Import PropTypes

export const StudentTable = ({ loading, students, handleDelete }) => {
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (students.length === 0) {
    return <div className="rounded-lg border p-8 text-center text-gray-500">No students found.</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Branch</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Creator</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-gray-500">ID: {student.student_id}</div>
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {student.branch}
                </span>
              </td>
              <td className="px-6 py-4">{student.creator_username || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(student.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(student.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
StudentTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  // We replace .object with a more descriptive .shape
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      student_id: PropTypes.string.isRequired,
      branch: PropTypes.string,
      creator_username: PropTypes.string,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleDelete: PropTypes.func.isRequired,
}
