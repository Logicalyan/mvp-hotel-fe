// ============================================
// 2. FILTER COMPONENT - components/reservations/ReservationByHotelFilters.jsx
// ============================================

"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, RotateCcw } from "lucide-react"
import { Label } from "@/components/ui/label"

export function ReservationByHotelFilters({ filters, onFiltersChange }) {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    const clearAllFilters = () => {
        onFiltersChange({
            search: "",
            reservation_status: null,
            payment_status: null,
            from_date: null,
            to_date: null,
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Reservation Status Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Status Reservasi</Label>
                    <Select
                        value={filters.reservation_status || "all"}
                        onValueChange={(value) => 
                            handleFilterChange('reservation_status', value === "all" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            {/* <SelectItem value="pending">Pending</SelectItem> */}
                            <SelectItem value="booked">Dipesan</SelectItem>
                            <SelectItem value="checked_in">Checked In</SelectItem>
                            <SelectItem value="checked_out">Checked Out</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Status Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Status Pembayaran</Label>
                    <Select
                        value={filters.payment_status || "all"}
                        onValueChange={(value) => 
                            handleFilterChange('payment_status', value === "all" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Belum Bayar</SelectItem>
                            <SelectItem value="paid">Lunas</SelectItem>
                            <SelectItem value="refunded">Refund</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* From Date Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Check-in Dari</Label>
                    <Input
                        type="date"
                        value={filters.from_date || ""}
                        onChange={(e) => handleFilterChange('from_date', e.target.value)}
                    />
                </div>

                {/* To Date Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Check-out Sampai</Label>
                    <Input
                        type="date"
                        value={filters.to_date || ""}
                        onChange={(e) => handleFilterChange('to_date', e.target.value)}
                    />
                </div>

                {/* Sort Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Urutkan</Label>
                    <Select
                        value={filters.sort || "default"}
                        onValueChange={(value) => 
                            handleFilterChange('sort', value === "default" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Terbaru</SelectItem>
                            <SelectItem value="check_in_date,asc">Check-in (Terlama)</SelectItem>
                            <SelectItem value="check_in_date,desc">Check-in (Terbaru)</SelectItem>
                            <SelectItem value="check_out_date,asc">Check-out (Terlama)</SelectItem>
                            <SelectItem value="check_out_date,desc">Check-out (Terbaru)</SelectItem>
                            <SelectItem value="total_price,asc">Harga (Terendah)</SelectItem>
                            <SelectItem value="total_price,desc">Harga (Tertinggi)</SelectItem>
                            <SelectItem value="nights,asc">Malam (Sedikit)</SelectItem>
                            <SelectItem value="nights,desc">Malam (Banyak)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}