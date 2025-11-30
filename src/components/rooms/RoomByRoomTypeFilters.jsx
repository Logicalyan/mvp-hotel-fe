// components/rooms/RoomByRoomTypeFilters.jsx
"use client"
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

export function RoomByRoomTypeFilters({ filters, onFiltersChange }) {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    const clearAllFilters = () => {
        onFiltersChange({
            search: "",
            status: null,
            floor: null,
            is_active: null,
            sort: null
        })
    }

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
        if (key === 'search') return value !== "" && value !== null
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={filters.status || "all"}
                        onValueChange={(value) => 
                            handleFilterChange('status', value === "all" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Floor Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Floor</label>
                    <Select
                        value={filters.floor?.toString() || "all"}
                        onValueChange={(value) => 
                            handleFilterChange('floor', value === "all" ? null : parseInt(value))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Floors" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Floors</SelectItem>
                            {[...Array(20)].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    Floor {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Active Status Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Active Status</label>
                    <Select
                        value={filters.is_active?.toString() || "all"}
                        onValueChange={(value) => 
                            handleFilterChange('is_active', value === "all" ? null : value === "1")
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                        value={filters.sort || "default"}
                        onValueChange={(value) => 
                            handleFilterChange('sort', value === "default" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Default Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="room_number,asc">Room Number (Low-High)</SelectItem>
                            <SelectItem value="room_number,desc">Room Number (High-Low)</SelectItem>
                            <SelectItem value="floor,asc">Floor (Low-High)</SelectItem>
                            <SelectItem value="floor,desc">Floor (High-Low)</SelectItem>
                            <SelectItem value="created_at,desc">Newest First</SelectItem>
                            <SelectItem value="created_at,asc">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}