// app/api/midtrans/route.js
import { NextResponse } from 'next/server';
const midtransClient = require('midtrans-client');

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Inisialisasi Snap
    const snap = new midtransClient.Snap({
      isProduction: false, // ubah ke true untuk production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: body.amount
      },
      customer_details: {
        first_name: body.firstName,
        email: body.email,
        phone: body.phone
      }
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}