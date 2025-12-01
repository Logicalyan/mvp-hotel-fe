"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"

export function HotelFacilityFilters({ filters, onFiltersChange }) {

    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    const clearAllFilters = () => {
        onFiltersChange({
            search: "",
            sort: null
        })
    }

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "search") return value !== ""
        return value !== null && value !== undefined
    }).length

    return (
        <div className="space-y-4 p-4 border rounded-lg">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={filters.search || ""}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        placeholder="Search facility name..."
                    />
                </div> */}

                {/* Sort Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                        value={filters.sort || "default"}
                        onValueChange={(value) => handleFilterChange("sort", value === "default" ? null : value)}
                    >
                        <SelectTrigger>
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
