// app/(protected)/layout.jsx   ← atau app/dashboard/layout.jsx
'use client';

import { useEffect } from 'react';

export default function ProtectedLayout({ children }) {
    useEffect(() => {
        // Cuma load kalau belum ada
        if (window.snap) return;

        const script = document.createElement('script');
        script.src = "https://app.sandbox.midtrans.com/snap/snap.min.js";
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return <>{children}</>;
}