'use client'; // jika menggunakan App Router

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentPage() {
    const [snapLoaded, setSnapLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load Snap.js
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
        script.onload = () => setSnapLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        try {
            // Request snap token dari API route
            const response = await fetch('/api/midtrans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 100000,
                    firstName: 'John',
                    email: 'john@example.com',
                    phone: '08123456789'
                })
            });

            const data = await response.json();

            // Trigger Snap popup
            if (snapLoaded && window.snap) {
                window.snap.pay(data.token, {
                    onSuccess: (result) => {
                        // Simpan ke sessionStorage
                        sessionStorage.setItem('paymentResult', JSON.stringify(result));
                        router.push('/payment/success');
                    },
                    onPending: (result) => {
                        console.log('Payment pending:', result);
                    },
                    onError: (result) => {
                        console.log('Payment error:', result);
                    },
                    onClose: () => {
                        console.log('Payment popup closed');
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button onClick={handlePayment}>
                Bayar Sekarang
            </button>
        </div>
    );
}