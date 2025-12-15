// app/api/midtrans/reservation/user/route.js
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
    try {
        const { reservation_id } = await request.json();

        console.log('🔍 Creating payment for reservation:', reservation_id);

        // Ambil data reservasi dari Laravel PUBLIC endpoint
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservation_id}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Failed to fetch reservation:', errorText);
            return NextResponse.json(
                { error: "Reservasi tidak ditemukan" }, 
                { status: 404 }
            );
        }

        const result = await res.json();
        console.log('✅ Reservation data:', result);

        if (!result.success || !result.data) {
            return NextResponse.json(
                { error: "Data reservasi tidak valid" }, 
                { status: 404 }
            );
        }

        const reservation = result.data;

        // Prepare Midtrans parameter
        const parameter = {
            transaction_details: {
                order_id: reservation.reservation_code,
                gross_amount: parseInt(reservation.total_price),
            },
            customer_details: {
                first_name: reservation.guest_name || "Tamu",
                phone: reservation.guest_phone,
                email: reservation.guest_email || "noemail@hotel.com",
            },
            item_details: [
                {
                    id: `RES-${reservation.id}`,
                    price: parseInt(reservation.total_price),
                    quantity: 1,
                    name: `${reservation.room_type?.name || 'Kamar'} - ${reservation.nights} malam`,
                },
            ],
            callbacks: {
                finish: `${process.env.NEXT_PUBLIC_APP_URL}/reservation/${reservation.id}?payment=success`,
            },
        };

        console.log('📤 Creating Midtrans transaction:', parameter);

        const transaction = await snap.createTransaction(parameter);

        console.log('✅ Midtrans token created:', transaction.token);

        return NextResponse.json({
            success: true,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });

    } catch (error) {
        console.error("❌ Midtrans API Error:", error);
        return NextResponse.json(
            { error: error.message || "Gagal membuat pembayaran" }, 
            { status: 500 }
        );
    }
}