// lib/utils/formatTime.js
export function formatTime(timeString) {
    if (!timeString) return null;

    // Jika sudah format HH:mm atau HH:mm:ss → langsung pakai
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
        return timeString.slice(0, 5).replace(":", ".") + " WIB";
    }

    // Jika full datetime (ISO) → ambil jam-menit saja
    try {
        const date = new Date(timeString);
        if (isNaN(date)) return null;
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).replace(":", ".") + " WIB";
    } catch {
        return null;
    }
}