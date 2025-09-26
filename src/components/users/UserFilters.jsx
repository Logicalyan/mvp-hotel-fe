"use client"

import { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, RotateCcw } from "lucide-react"

export function UserFilters({ filters, onFiltersChange }) {
  
  // ✅ Memoize handler untuk mencegah unnecessary re-renders
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }, [filters, onFiltersChange])

  // ✅ Memoize clear handler
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      role: null,
      status: null,
      sort: null
    }
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  // ✅ Memoize active filters count calculation
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'search') return value !== "" && value !== null
      return value !== null && value !== undefined
    }).length
  }, [filters])

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Header dengan ikon dan jumlah filter aktif */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Grid untuk filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={filters.role || "all"}
            onValueChange={(value) => handleFilterChange("role", value === "all" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Status Verifikasi</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value === "all" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Terverifikasi</SelectItem>
              <SelectItem value="unverified">Belum Verifikasi</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select
            value={filters.sort || "default"}
            onValueChange={(value) => handleFilterChange("sort", value === "default" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Default Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name,asc">Name A-Z</SelectItem>
              <SelectItem value="name,desc">Name Z-A</SelectItem>
              <SelectItem value="created_at,desc">Newest First</SelectItem>
              <SelectItem value="created_at,asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}