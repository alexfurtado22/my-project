import React, { useState } from 'react'
import apiClient from '../api'

const branches = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT']

export const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    student_id: '',
    branch: '',
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await apiClient.post('/students/', formData)
      onStudentAdded() // Tell the dashboard to refresh
      onClose() // Close the modal
    } catch (err) {
      console.error('Failed to add student:', err)
      setError(err.response?.data?.detail || 'Failed to create student. Please check the data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold">Add New Student</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-gray-700">Student ID</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-gray-700">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            >
              <option value="">Select a Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-6 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Saving...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
