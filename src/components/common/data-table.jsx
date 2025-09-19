"use client"

import React, { useEffect, useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table/data-table-pagination"
import { useDebounce } from "@/hooks/useDebounce"

export function DataTable({ 
    columns, 
    data, 
    pageCount, 
    state, 
    onPaginationChange, 
    onFiltersChange, 
    meta,
    searchConfig = {
        enabled: true,
        placeholder: "Search...",
        debounceMs: 500
    },
    showColumnToggle = true,
    emptyStateMessage,
    className = "",
    tableConfig = {},
    filterComponent // Prop untuk custom filter component
}) {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [search, setSearch] = useState("")
    
    // Debounce search input
    const debouncedSearch = useDebounce(search, searchConfig.debounceMs)

    // Sync search dengan filters.search dari parent
    useEffect(() => {
        if (searchConfig.enabled) {
            const currentSearch = state?.filters?.search || ""
            if (currentSearch !== search) {
                setSearch(currentSearch)
            }
        }
    }, [state?.filters?.search, searchConfig.enabled])

    // Kirim debounced search ke parent via generic filter handler
    useEffect(() => {
        if (searchConfig.enabled && onFiltersChange) {
            onFiltersChange({ search: debouncedSearch })
        }
    }, [debouncedSearch, onFiltersChange, searchConfig.enabled])

    const table = useReactTable({
        data,
        columns,
        pageCount,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        meta,
        ...tableConfig,
        state: {
            ...state,
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Auto-generate empty message based on data type
    const getEmptyMessage = () => {
        if (emptyStateMessage) return emptyStateMessage
        
        const hasFilters = state?.filters && Object.values(state.filters).some(value => 
            value !== null && value !== undefined && value !== ""
        )
        
        if (hasFilters) {
            return "No data found with current filters."
        }
        
        return "No data available."
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Filter Section */}
            {filterComponent && (
                <div className="rounded-lg border p-4">
                    {React.cloneElement(filterComponent, {
                        filters: state?.filters || {},
                        onFiltersChange
                    })}
                </div>
            )}

            {/* Header dengan search bar dan column toggle */}
            {(searchConfig.enabled || showColumnToggle) && (
                <div className="flex items-center justify-between">
                    {searchConfig.enabled && (
                        <Input
                            placeholder={searchConfig.placeholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    )}
                    {showColumnToggle && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    {getEmptyMessage()}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <DataTablePagination table={table} />
        </div>
    )
}
