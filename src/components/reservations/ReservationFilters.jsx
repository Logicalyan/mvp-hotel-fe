"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Filter, RotateCcw, CalendarIcon } from "lucide-react";

export function ReservationFilters({ filters = {}, onFiltersChange }) {
    const safeFilters = filters || {};

    // Hitung filter aktif
    const activeFiltersCount = useMemo(() => {
        return Object.entries(safeFilters).filter(([key, value]) => {
            if (key === "search") return value && value !== "";
            if (key === "from_date" || key === "to_date") return value !== null;
            if (key === "status") return value && value !== "all";
            if (key === "payment_status") return value && value !== "all";
            return false;
        }).length;
    }, [safeFilters]);

    const handleFilterChange = (key, value) => {
        if (!onFiltersChange) return;
        onFiltersChange({ ...safeFilters, [key]: value });
    };

    const clearAllFilters = () => {
        if (!onFiltersChange) return;
        onFiltersChange({
            search: "",
            status: "all",
            payment_status: "all",
            from_date: null,
            to_date: null,
        });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <h3 className="font-medium">Filter Reservasi</h3>
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

            {/* Select Filters - Style persis RoomTypeFilters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Reservasi */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status Reservasi</label>
                    <Select
                        value={safeFilters.status || "all"}
                        onValueChange={(value) =>
                            handleFilterChange("status", value === "all" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="booked">Dipesan</SelectItem>
                            <SelectItem value="checked_in">Check In</SelectItem>
                            <SelectItem value="checked_out">Check Out</SelectItem>
                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Pembayaran */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status Pembayaran</label>
                    <Select
                        value={safeFilters.payment_status || "all"}
                        onValueChange={(value) =>
                            handleFilterChange("payment_status", value === "all" ? null : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih pembayaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Pembayaran</SelectItem>
                            <SelectItem value="pending">Belum Dibayar</SelectItem>
                            <SelectItem value="paid">Lunas</SelectItem>
                            <SelectItem value="refunded">Dikembalikan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Check In Dari */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Check In Dari</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {safeFilters.from_date ? (
                                    format(safeFilters.from_date, "dd MMM yyyy", { locale: id })
                                ) : (
                                    <span>Pilih tanggal</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={safeFilters.from_date || undefined}
                                onSelect={(date) => handleFilterChange("from_date", date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Check Out Sampai */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Check Out Sampai</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {safeFilters.to_date ? (
                                    format(safeFilters.to_date, "dd MMM yyyy", { locale: id })
                                ) : (
                                    <span>Pilih tanggal</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={safeFilters.to_date || undefined}
                                onSelect={(date) => handleFilterChange("to_date", date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}