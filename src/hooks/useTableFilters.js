// hooks/useTableFilters.js
import { useState, useCallback, useEffect, useRef } from 'react'

export function useTableFilters(
  fetchFunction,
  initialFilters = {},
  initialPagination = { pageIndex: 0, pageSize: 10 }
) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [pagination, setPagination] = useState(initialPagination)
  const [pageMeta, setPageMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: initialPagination.pageSize,
  })
  const [filters, setFilters] = useState(initialFilters)

  // ✅ FIX 1: Use ref to store fetchFunction (prevent infinite loop)
  const fetchFunctionRef = useRef(fetchFunction)
  
  // Update ref when fetchFunction changes (but don't trigger re-render)
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction
  }, [fetchFunction])

  // ✅ FIX 2: Add abort controller for cleanup
  const abortControllerRef = useRef(null)

  // ✅ FIX 3: Memoize cleanFilters calculation
  const cleanFilters = useCallback(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (key === 'search') return value !== "" && value !== null
        if (Array.isArray(value)) return value.length > 0
        return value !== null && value !== undefined
      })
    )
  }, [filters])

  // ✅ FIX 4: Remove fetchFunction from dependencies
  const fetchData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)
    
    try {
      const apiPage = pagination.pageIndex + 1
      const filters = cleanFilters()

      console.log('🔍 Fetching data with:', {
        page: apiPage,
        pageSize: pagination.pageSize,
        filters: filters
      })

      // ✅ Use ref instead of direct fetchFunction
      const res = await fetchFunctionRef.current(apiPage, filters, pagination.pageSize)

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 Request aborted')
        return
      }

      // Handle different response structures
      const responseData = res.users 
        || res.hotels 
        || res.bedTypes 
        || res.roomTypes
        || res.roomTypesByHotel
        || res.rooms
        || res.data 
        || []
      const responseMeta = res.meta

      setData(responseData)
      setPageMeta(responseMeta)

      console.log('✅ Data fetched:', {
        totalItems: responseData.length,
        totalFound: responseMeta.total,
        currentPage: responseMeta.current_page,
      })

    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        console.log('🚫 Request cancelled')
        return
      }

      console.error("❌ Error fetching data:", err)
      setError(err.message || 'Failed to fetch data')
      setData([])
      setPageMeta({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: pagination.pageSize,
      })
    } finally {
      // Only set loading false if not aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false)
      }
    }
  }, [pagination.pageIndex, pagination.pageSize, cleanFilters])
  // ↑ NOTICE: fetchFunction TIDAK ada di dependencies!

  // ✅ FIX 5: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('🔄 Filters changed:', newFilters)
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [])

  // Handle complete filter replacement
  const handleFiltersReplace = useCallback((newFilters) => {
    console.log('🔄 Filters replaced:', newFilters)
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [])

  // Handle pagination changes
  const handlePaginationChange = useCallback((updater) => {
    setPagination(prev => {
      const newPagination = typeof updater === 'function' ? updater(prev) : updater

      console.log('📄 Pagination changed:', {
        from: prev,
        to: newPagination
      })

      // If pageSize changes, reset to first page
      if (newPagination.pageSize !== prev.pageSize) {
        return { ...newPagination, pageIndex: 0 }
      }

      return newPagination
    })
  }, [])

  // Refresh data
  const refreshData = useCallback(() => {
    console.log('🔄 Refreshing data...')
    fetchData()
  }, [fetchData])

  // Reset filters
  const resetFilters = useCallback(() => {
    console.log('🔄 Resetting filters...')
    setFilters(initialFilters)
    setPagination(initialPagination)
  }, [initialFilters, initialPagination])

  return {
    data,
    loading,
    error,
    pagination,
    pageMeta,
    filters,
    handleFiltersChange,
    handleFiltersReplace, 
    handlePaginationChange,
    refreshData,
    resetFilters,
    fetchData,
  }
}