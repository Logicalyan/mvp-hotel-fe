"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function HotelFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: "",
    province_id: "",
    city_id: "",
    district_id: "",
    sub_district_id: "",
    facilities: "",
    sort: "name,asc",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onFilterChange(filters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <Input
        name="search"
        placeholder="Search by name, description, or address..."
        value={filters.search}
        onChange={handleInputChange}
      />
      <Select onValueChange={(value) => handleSelectChange("province_id", value)} value={filters.province_id}>
        <SelectTrigger>
          <SelectValue placeholder="Select Province" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Province 1</SelectItem>
          <SelectItem value="2">Province 2</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleSelectChange("city_id", value)} value={filters.city_id}>
        <SelectTrigger>
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">City 1</SelectItem>
          <SelectItem value="2">City 2</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleSelectChange("district_id", value)} value={filters.district_id}>
        <SelectTrigger>
          <SelectValue placeholder="Select District" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">District 1</SelectItem>
          <SelectItem value="2">District 2</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleSelectChange("sub_district_id", value)} value={filters.sub_district_id}>
        <SelectTrigger>
          <SelectValue placeholder="Select Sub District" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Sub District 1</SelectItem>
          <SelectItem value="2">Sub District 2</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name="facilities"
        placeholder="Enter facility IDs (comma-separated)"
        value={filters.facilities}
        onChange={handleInputChange}
      />
      <Select onValueChange={(value) => handleSelectChange("sort", value)} value={filters.sort}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name,asc">Name (A-Z)</SelectItem>
          <SelectItem value="name,desc">Name (Z-A)</SelectItem>
          <SelectItem value="created_at,desc">Newest</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
        Apply Filters
      </Button>
    </div>
  );
}