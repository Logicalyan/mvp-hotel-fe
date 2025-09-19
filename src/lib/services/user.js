import api from "../api";

// lib/services/user.js
export async function getUsers(page = 1, filters = {}, pageSize = 10) {
    const params = new URLSearchParams({
        page,
        per_page: pageSize,
    })

    // Loop semua filters
    Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return

        if (Array.isArray(value)) {
            if (value.length > 0) {
                params.append(key, value.join(","))
            }
        } else {
            params.append(key, value.toString())
        }
    })

    const res = await api.get(`/users?${params.toString()}`)

    return {
        meta: {
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
            per_page: res.data.data.per_page,
        },
        users: res.data.data.data,
    }
}

// Ambil hotel detail
export async function getUserById(id) {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
}

// Tambah hotel
export async function createUser(payload) {
    const res = await api.post("/users", payload);
    return res.data.data;
}

// Update hotel
export async function updateUser(id, payload) {
    
    const res = await api.post(`/users/${id}`, payload);
    return res.data.data;
}

// Hapus hotel
export async function deleteUser(id) {
    const res = await api.delete(`/users/${id}`);
    return res.data.data;
}
