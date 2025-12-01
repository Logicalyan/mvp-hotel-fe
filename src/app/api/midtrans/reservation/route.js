// app/api/midtrans/reservation/route.js
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,           // JANGAN PERNAH EXPOSE INI!
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
    try {
        const { reservation_id, hotel_id } = await request.json();

        // Ambil data reservasi dari Laravel (hanya buat ambil detail)
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/hotel/${hotel_id}/reservations/${reservation_id}`
        );
        const result = await res.json();

        if (!res.ok || !result.data) {
            return NextResponse.json({ error: "Reservasi tidak ditemukan" }, { status: 404 });
        }

        const reservation = result.data;

        const parameter = {
            transaction_details: {
                order_id: reservation.reservation_code,
                gross_amount: reservation.total_price,
            },
            customer_details: {
                first_name: reservation.guest_name || "Tamu",
                phone: reservation.guest_phone,
                email: reservation.guest_email || "noemail@hotel.com",
            },
            item_details: [
                {
                    id: `RES-${reservation.id}`,
                    price: reservation.total_price,
                    quantity: 1,
                    name: `Kamar ${reservation.roomType?.name || reservation.room?.room_type?.name} - ${reservation.nights} malam`,
                },
            ],
        };

        const transaction = await snap.createTransaction(parameter);

        return NextResponse.json({
            token: transaction.token,
        });
    } catch (error) {
        console.error("Midtrans API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}