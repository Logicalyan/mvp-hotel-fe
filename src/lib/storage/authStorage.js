// lib/storage/authStorage.js
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const TOKEN_KEY = "token";
export const ROLE_KEY = "role";
export const HOTEL_ID_KEY = "hotel_id";

export function setAuth(token, role, hotelId = null) {

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 setAuth CALLED WITH:');
    console.log('  - token:', token ? `${token.substring(0, 20)}...` : 'NULL/UNDEFINED');
    console.log('  - role:', role);
    console.log('  - role type:', typeof role);
    console.log('  - role value:', JSON.stringify(role));
    console.log('  - hotelId:', hotelId);
    console.log('  - hotelId type:', typeof hotelId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ✅ VALIDATION: Pastikan role adalah string dan tidak undefined
    if (!role || role === 'undefined' || role === 'null') {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ Invalid role received:', role);
        console.error('   Role type:', typeof role);
        console.error('   This will prevent login from working!');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return;
    }

    // Cek dari env variable atau fallback ke NODE_ENV
    const useSecureCookie = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true' 
        || process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: '/',
        secure: useSecureCookie, // false di development
        sameSite: 'lax',
        httpOnly: false,
    };
    
    setCookie(TOKEN_KEY, token, cookieOptions);
    
    // Set role (pastikan string)
    const roleString = String(role);
    console.log('✅ Setting role cookie:', roleString);
    setCookie(ROLE_KEY, roleString, cookieOptions);

    // ✅ STORE hotel_id untuk role hotel
    if (hotelId) {
        console.log('✅ Setting hotel_id cookie:', hotelId);
        setCookie(HOTEL_ID_KEY, hotelId.toString(), cookieOptions);
    }
    
    // Log untuk debugging (hapus di production)
    if (!useSecureCookie) {
        console.log('🔓 Development mode: cookies set without secure flag');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ setAuth COMPLETED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

export function clearAuth() {
    deleteCookie(TOKEN_KEY, { path: '/' });
    deleteCookie(ROLE_KEY, { path: '/' });
    deleteCookie(HOTEL_ID_KEY, { path: '/' });
}

export function getToken() {
    return getCookie(TOKEN_KEY);
}

export function getRole() {
    return getCookie(ROLE_KEY);
}

export function getHotelId() {
    const hotelId = getCookie(HOTEL_ID_KEY);
    return hotelId ? parseInt(hotelId) : null;
}
