import axios from "axios"
import { getToken } from "./storage/authStorage";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer",
        // 'Access-Control-Allow-Origin': '*'
    }
})

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
});

export default api