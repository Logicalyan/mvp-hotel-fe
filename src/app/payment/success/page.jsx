'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('paymentResult');
        if (data) {
            setPaymentData(JSON.parse(data));
            // Hapus setelah diambil - SUDAH BENAR!
            sessionStorage.removeItem('paymentResult');
        }
    }, []);

    // Tambahkan loading state
    if (!paymentData) {
        return (
            <div className="container mx-auto p-8 text-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 text-center">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h1 className="text-2xl font-bold mb-4">Pembayaran Berhasil!</h1>
                
                <p className="text-gray-600 mb-2">
                    Order ID: <span className="font-semibold">{paymentData.order_id}</span>
                </p>
                <p className="text-gray-600 mb-4">
                    Status: <span className="font-semibold">{paymentData.transaction_status}</span>
                </p>
                
                <p className="text-gray-600 mb-6">
                    Terima kasih atas pembayaran Anda.
                </p>
                
                <Link
                    href="/"
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}