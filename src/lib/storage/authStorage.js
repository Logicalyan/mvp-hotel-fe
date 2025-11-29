// lib/storage/authStorage.js
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const TOKEN_KEY = "token";
export const ROLE_KEY = "role";
export const HOTEL_ID_KEY = "hotel_id";

export function setAuth(token, role, hotelId = null) {

    console.log('💾 setAuth INPUT:', { 
        token: token ? `${token.substring(0, 20)}...` : null,
        role, 
        roleType: typeof role,
        roleValue: JSON.stringify(role),
        hotelId,
        hotelIdType: typeof hotelId
    });

    // ✅ VALIDATION: Pastikan role adalah string dan tidak undefined
    if (!role || role === 'undefined') {
        console.error('❌ Invalid role received:', role);
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
    console.log('💾 Setting role cookie:', roleString);
    setCookie(ROLE_KEY, roleString, cookieOptions);

    // ✅ STORE hotel_id untuk role hotel
    if (hotelId) {
        setCookie(HOTEL_ID_KEY, hotelId.toString(), cookieOptions);
    }
    
    // Log untuk debugging (hapus di production)
    if (!useSecureCookie) {
        console.log('🔓 Development mode: cookies set without secure flag');
    }
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
