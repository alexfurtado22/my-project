import { useState, useCallback } from 'react'
import apiClient from '../api'

const PAGE_SIZE = 10 // A more realistic page size

export const useStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [queryParams, setQueryParams] = useState({ search: '', branch: '' })

  const fetchStudents = useCallback(
    async (page = 1, params = queryParams) => {
      setLoading(true)
      setError(null)
      try {
        const urlParams = new URLSearchParams()
        urlParams.append('page', page)
        urlParams.append('page_size', PAGE_SIZE)
        if (params.search) urlParams.append('search', params.search)
        if (params.branch) urlParams.append('branch', params.branch)
        urlParams.append('ordering', '-created_at')

        const response = await apiClient.get(`/students/?${urlParams}`)

        setStudents(response.data.results || [])
        setTotalCount(response.data.count || 0)
        setTotalPages(Math.ceil((response.data.count || 0) / PAGE_SIZE))
        setCurrentPage(page)
      } catch (err) {
        console.error('Error fetching students:', err)
        setError(err.response?.data?.detail || 'Failed to fetch students')
      } finally {
        setLoading(false)
      }
    },
    [queryParams]
  )

  const handleDelete = useCallback(
    async (studentId) => {
      if (!window.confirm('Are you sure you want to delete this student?')) return
      try {
        await apiClient.delete(`/students/${studentId}/`)
        if (students.length === 1 && currentPage > 1) {
          fetchStudents(currentPage - 1)
        } else {
          fetchStudents(currentPage)
        }
      } catch (err) {
        console.error('Error deleting student:', err)
        alert('Failed to delete student: ' + (err.response?.data?.detail || 'Unknown error'))
      }
    },
    [students.length, currentPage, fetchStudents]
  )

  return {
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
  }
}
