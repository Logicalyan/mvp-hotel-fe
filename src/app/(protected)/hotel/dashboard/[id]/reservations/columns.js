// ============================================
// 4. COLUMNS - app/hotel/dashboard/[id]/reservations/columns.jsx
// ============================================

"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, CreditCard, LogIn, LogOut, XCircle } from "lucide-react"
// import { 
//     cancelReservation,
//     checkInReservation,
//     checkOutReservation 
// } from "@/lib/services/hotels/reservation"

import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useAuth } from "@/hooks/useAuth"
import { checkInReservation, checkOutReservation } from "@/lib/services/hotels/reservation"

// ====================
// STATUS BADGE
// ====================
const StatusBadge = ({ status, type = "reservation" }) => {
    const config = {
        reservation: {
            pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
            booked: { label: "Dipesan", class: "bg-blue-100 text-blue-800" },
            checked_in: { label: "Check In", class: "bg-green-100 text-green-800" },
            checked_out: { label: "Check Out", class: "bg-gray-100 text-gray-800" },
            cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
        },
        payment: {
            pending: { label: "Belum Dibayar", class: "bg-orange-100 text-orange-800" },
            unpaid: { label: "Belum Dibayar", class: "bg-orange-100 text-orange-800" },
            paid: { label: "Lunas", class: "bg-green-100 text-green-800" },
            refunded: { label: "Dikembalikan", class: "bg-red-100 text-red-800" },
        },
    }

    const item = config[type][status] || { label: status, class: "bg-gray-100 text-gray-800" }

    return <Badge className={item.class}>{item.label}</Badge>
}

// ====================
// RESERVATION ACTIONS
// ====================
const ReservationActions = ({ reservation, refreshData }) => {
    const [isPaying, setIsPaying] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const { hotelId, role } = useAuth()

    // Admin bisa lihat semua hotel, staff hanya hotel miliknya
    const currentHotelId = role === "admin" 
        ? reservation.roomType?.hotel_id || reservation.room?.room_type?.hotel_id
        : hotelId

    const handlePayment = async () => {
        if (isPaying) return
        setIsPaying(true)

        try {
            toast.loading("Membuat pembayaran...", { id: "midtrans" })

            const response = await fetch("/api/midtrans/reservation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reservation_id: reservation.id,
                    hotel_id: currentHotelId,
                }),
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Gagal membuat pembayaran")

            toast.dismiss("midtrans")
            toast.loading("Membuka Midtrans...", { duration: 3000 })

            const waitForSnap = () => new Promise((resolve) => {
                if (window.snap?.pay) return resolve()
                const check = setInterval(() => {
                    if (window.snap?.pay) {
                        clearInterval(check)
                        resolve()
                    }
                }, 100)
            })

            await waitForSnap()

            window.snap.pay(data.token, {
                onSuccess: () => {
                    toast.success("Pembayaran berhasil!")
                    refreshData?.()
                    setIsPaying(false)
                },
                onPending: () => {
                    toast.info("Menunggu pembayaran...")
                    setIsPaying(false)
                },
                onError: () => {
                    toast.error("Pembayaran gagal")
                    setIsPaying(false)
                },
                onClose: () => setIsPaying(false),
            })

        } catch (err) {
            toast.error(err.message || "Gagal memulai pembayaran")
            setIsPaying(false)
        }
    }

    const handleCheckIn = async () => {
        try {
            setIsProcessing(true)
            await checkInReservation(reservation.id)
            toast.success("Check-in berhasil")
            refreshData?.()
        } catch (error) {
            toast.error(error.message || "Gagal check-in")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCheckOut = async () => {
        try {
            setIsProcessing(true)
            await checkOutReservation(reservation.id)
            toast.success("Check-out berhasil")
            refreshData?.()
        } catch (error) {
            toast.error(error.message || "Gagal check-out")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCancel = async () => {
        try {
            setIsProcessing(true)
            await cancelReservation(reservation.id)
            toast.success("Reservasi berhasil dibatalkan")
            refreshData?.()
        } catch (error) {
            toast.error(error.message || "Gagal membatalkan reservasi")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu aksi</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Link href={`/hotel/dashboard/${currentHotelId}/reservations/${reservation.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                    </DropdownMenuItem>
                </Link>

                {/* Tombol Bayar Sekarang */}
                {(reservation.payment_status === "pending" || reservation.payment_status === "unpaid") && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-green-600 font-medium cursor-pointer"
                            onClick={handlePayment}
                            disabled={isPaying}
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isPaying ? "Memproses..." : "Bayar Sekarang"}
                        </DropdownMenuItem>
                    </>
                )}

                {/* Check In & Batalkan */}
                {(reservation.reservation_status === "booked" && reservation.payment_status === "paid") && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-green-600 cursor-pointer"
                            onClick={handleCheckIn}
                            disabled={isProcessing}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Check In
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-orange-600 cursor-pointer"
                            onClick={handleCancel}
                            disabled={isProcessing}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Batalkan
                        </DropdownMenuItem>
                    </>
                )}

                {/* Check Out */}
                {reservation.reservation_status === "checked_in" && (
                    <DropdownMenuItem 
                        className="text-blue-600 cursor-pointer"
                        onClick={handleCheckOut}
                        disabled={isProcessing}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Check Out
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// ====================
// COLUMNS UNTUK DATA TABLE
// ====================
export const columns = [
    {
        accessorKey: "reservation_code",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Booking" />,
        cell: ({ row }) => (
            <div className="font-mono font-medium text-sm">{row.getValue("reservation_code")}</div>
        ),
    },
    {
        accessorKey: "guest_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tamu" />,
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.guest_name}</div>
                <div className="text-xs text-muted-foreground">{row.original.guest_phone}</div>
            </div>
        ),
    },
    {
        accessorKey: "roomType.name",
        header: "Tipe Kamar",
        cell: ({ row }) => row.original.roomType?.name || row.original.room?.room_type?.name || "-",
    },
    {
        accessorKey: "check_in_date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Check In Date" />,
        cell: ({ row }) => {
            const checkIn = row.getValue("check_in_date")
            if (!checkIn) return <span className="text-muted-foreground">-</span>
            try {
                return format(new Date(checkIn), "dd MMM yyyy", { locale: id })
            } catch {
                return <span className="text-muted-foreground">-</span>
            }
        },
    },
    {
        accessorKey: "actual_check_in",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Actual Check In" />,
        cell: ({ row }) => {
            const checkIn = row.getValue("actual_check_in")
            if (!checkIn) return <span className="text-muted-foreground">-</span>
            try {
                return format(new Date(checkIn), "dd MMM yyyy HH.ii", { locale: id })
            } catch {
                return <span className="text-muted-foreground">-</span>
            }
        },
    },
    {
        accessorKey: "check_out_date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Check Out Date" />,
        cell: ({ row }) => {
            const checkOut = row.getValue("check_out_date")
            if (!checkOut) return <span className="text-muted-foreground">-</span>
            try {
                return format(new Date(checkOut), "dd MMM yyyy", { locale: id })
            } catch {
                return <span className="text-muted-foreground">-</span>
            }
        },
    },
    {
        accessorKey: "actual_check_out",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Actual Check Out" />,
        cell: ({ row }) => {
            const checkIn = row.getValue("actual_check_out")
            if (!checkIn) return <span className="text-muted-foreground">-</span>
            try {
                return format(new Date(checkIn), "dd MMM yyyy HH.ii", { locale: id })
            } catch {
                return <span className="text-muted-foreground">-</span>
            }
        },
    },
    {
        accessorKey: "nights",
        header: "Malam",
        cell: ({ row }) => <div className="text-center font-medium">{row.getValue("nights")}</div>,
    },
    {
        accessorKey: "total_price",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => (
            <div className="font-medium">
                Rp {Number(row.getValue("total_price")).toLocaleString("id-ID")}
            </div>
        ),
    },
    {
        accessorKey: "payment_status",
        header: "Pembayaran",
        cell: ({ row }) => <StatusBadge status={row.getValue("payment_status")} type="payment" />,
    },
    {
        accessorKey: "reservation_status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("reservation_status")} type="reservation" />,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dibuat" />,
        cell: ({ row }) => {
            const date = row.getValue("created_at")
            if (!date) return <span className="text-muted-foreground">-</span>
            try {
                const d = new Date(date)
                return (
                    <div className="flex flex-col text-xs">
                        <span>{format(d, "dd MMM yyyy", { locale: id })}</span>
                        <span className="text-muted-foreground">{format(d, "HH:mm")}</span>
                    </div>
                )
            } catch {
                return <span className="text-muted-foreground">-</span>
            }
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const reservation = row.original
            const refreshData = table.options.meta?.refreshData
            return <ReservationActions reservation={reservation} refreshData={refreshData} />
        },
    },
];