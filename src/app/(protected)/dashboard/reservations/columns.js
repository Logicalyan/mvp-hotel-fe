// app/reservations/columns.js
"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, Calendar, User, Phone, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";

const getStatusBadge = (status) => {
    const map = {
        booked: "bg-blue-100 text-blue-800",
        checked_in: "bg-green-100 text-green-800",
        checked_out: "bg-gray-100 text-gray-800",
        cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
};

const getPaymentBadge = (status) => {
    const map = {
        pending: "bg-orange-100 text-orange-800",
        paid: "bg-green-100 text-green-800",
        refunded: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
};

export const columns = [
    {
        accessorKey: "reservation_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Booking" />
        ),
        cell: ({ row }) => (
            <div className="font-mono font-medium">
                {row.getValue("reservation_code")}
            </div>
        ),
    },
    {
        accessorKey: "guest_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Tamu" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{row.getValue("guest_name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "guest_phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Telepon" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{row.getValue("guest_phone")}</span>
            </div>
        ),
    },
    {
        accessorKey: "room.room_type.name",
        header: "Tipe Kamar",
        cell: ({ row }) => row.original.room?.room_type?.name || "-",
    },
    {
        accessorKey: "check_in_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Check In" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("check_in_date");
            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(date), "dd MMM yyyy", { locale: id })}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "check_out_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Check Out" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("check_out_date");
            return format(new Date(date), "dd MMM yyyy", { locale: id });
        },
    },
    {
        accessorKey: "nights",
        header: "Malam",
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.getValue("nights")}
            </div>
        ),
    },
    {
        accessorKey: "total_price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Harga" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">
                Rp {Number(row.getValue("total_price")).toLocaleString("id-ID")}
            </div>
        ),
    },
    {
        accessorKey: "payment_status",
        header: "Pembayaran",
        cell: ({ row }) => {
            const status = row.getValue("payment_status");
            return (
                <Badge className={getPaymentBadge(status)}>
                    {status === "pending" ? "Belum Dibayar" :
                        status === "paid" ? "Lunas" :
                            status === "refunded" ? "Dikembalikan" : status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "reservation_status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("reservation_status");
            return (
                <Badge className={getStatusBadge(status)}>
                    {status === "booked" ? "Dipesan" :
                        status === "checked_in" ? "Check In" :
                            status === "checked_out" ? "Check Out" :
                                status === "cancelled" ? "Dibatalkan" : status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const reservation = row.original;
            return (
                <Link href={`/reservations/${reservation.id}`}>
                    <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="ml-2">Lihat</span>
                    </Button>
                </Link>
            );
        },
    },
];