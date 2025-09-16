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
import { 
  getProvinces, 
  getCities, 
  getDistricts, 
  getSubDistricts, 
  getFacilities 
} from "@/lib/services/reference"

export function HotelFilters({ filters, onFiltersChange }) {
  const [provinces, setProvinces] = useState([])
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [subDistricts, setSubDistricts] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    Promise.all([
      getProvinces(),
      getFacilities()
    ]).then(([provincesData, facilitiesData]) => {
      setProvinces(provincesData)
      setFacilities(facilitiesData)
    })
  }, [])

  // Load cities when province changes
  useEffect(() => {
    if (filters.province_id) {
      setLoading(true)
      getCities(filters.province_id).then(data => {
        setCities(data)
        setLoading(false)
      })
    } else {
      setCities([])
      setDistricts([])
      setSubDistricts([])
    }
  }, [filters.province_id])

  // Load districts when city changes
  useEffect(() => {
    if (filters.city_id) {
      setLoading(true)
      getDistricts(filters.city_id).then(data => {
        setDistricts(data)
        setLoading(false)
      })
    } else {
      setDistricts([])
      setSubDistricts([])
    }
  }, [filters.city_id])

  // Load sub districts when district changes
  useEffect(() => {
    if (filters.district_id) {
      setLoading(true)
      getSubDistricts(filters.district_id).then(data => {
        setSubDistricts(data)
        setLoading(false)
      })
    } else {
      setSubDistricts([])
    }
  }, [filters.district_id])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    
    // Reset dependent filters when parent changes
    if (key === 'province_id') {
      newFilters.city_id = null
      newFilters.district_id = null
      newFilters.sub_district_id = null
    } else if (key === 'city_id') {
      newFilters.district_id = null
      newFilters.sub_district_id = null
    } else if (key === 'district_id') {
      newFilters.sub_district_id = null
    }
    
    onFiltersChange(newFilters)
  }

  const handleFacilityToggle = (facilityId) => {
    const currentFacilities = filters.facilities || []
    const newFacilities = currentFacilities.includes(facilityId)
      ? currentFacilities.filter(id => id !== facilityId)
      : [...currentFacilities, facilityId]
    
    onFiltersChange({ ...filters, facilities: newFacilities })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      province_id: null,
      city_id: null,
      district_id: null,
      sub_district_id: null,
      facilities: [],
      sort: null
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== "" && value !== null
    if (key === 'facilities') return Array.isArray(value) && value.length > 0
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
        {/* Province Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Province</label>
          <Select
            value={filters.province_id?.toString() || "all"}
            onValueChange={(value) => handleFilterChange('province_id', value === "all" ? null : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id.toString()}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Select
            value={filters.city_id?.toString() || "all"}
            onValueChange={(value) => handleFilterChange('city_id', value === "all" ? null : parseInt(value))}
            disabled={!filters.province_id || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">District</label>
          <Select
            value={filters.district_id?.toString() || "all"}
            onValueChange={(value) => handleFilterChange('district_id', value === "all" ? null : parseInt(value))}
            disabled={!filters.city_id || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub District Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sub District</label>
          <Select
            value={filters.sub_district_id?.toString() || "all"}
            onValueChange={(value) => handleFilterChange('sub_district_id', value === "all" ? null : parseInt(value))}
            disabled={!filters.district_id || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sub District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub Districts</SelectItem>
              {subDistricts.map((subDistrict) => (
                <SelectItem key={subDistrict.id} value={subDistrict.id.toString()}>
                  {subDistrict.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Facilities Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Facilities</label>
        <div className="flex flex-wrap gap-2">
          {facilities.map((facility) => (
            <Badge
              key={facility.id}
              variant={filters.facilities?.includes(facility.id) ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => handleFacilityToggle(facility.id)}
            >
              {facility.name}
              {filters.facilities?.includes(facility.id) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select
          value={filters.sort || "default"}
          onValueChange={(value) => handleFilterChange('sort', value === "default" ? null : value)}
        >
          <SelectTrigger className="w-48">
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
  )
}