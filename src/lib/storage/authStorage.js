import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const TOKEN_KEY = "token"
export const ROLE_KEY = "role"

export function setAuth(token, role) {
    setCookie(TOKEN_KEY, token);
    setCookie(ROLE_KEY, role);
    
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ROLE_KEY, role)
    }

}

export function clearAuth() {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY)
    }

    deleteCookie(TOKEN_KEY);
    deleteCookie(ROLE_KEY);
}

export function getToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem(TOKEN_KEY)
    }

    return getCookie(TOKEN_KEY)
}

export function getRole() {
    if (typeof window !== "undefined") {
        return localStorage.getItem(ROLE_KEY);
    }
    return getCookie(ROLE_KEY);
}