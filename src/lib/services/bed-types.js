import api from "../api"

export async function getBedType(page = 1, filters = {}, pageSize = 10) {
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

    const res = await api.get(`/bed-types?${params.toString()}`)

    return {
        meta: {
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
            per_page: res.data.data.per_page,
        },
        bedTypes: res.data.data.data,
    }
}

// Ambil bed type detail
export async function getBedTypeById(id) {
    const res = await api.get(`/bed-types/${id}`);
    return res.data.data;
}

// Tambah bed type
export async function createBedType(payload) {
    const res = await api.post("/bed-types", payload);
    return res.data.data;
}

// Update bed type
export async function updateBedType(id, payload) {
    const res = await api.post(`/bed-types/${id}`, payload);
    return res.data.data;
}

// Hapus bed type
export async function deleteBedType(id) {
    const res = await api.delete(`/bed-types/${id}`);
    return res.data.data;
}