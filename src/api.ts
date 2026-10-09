// local development
const BASE_URL = "http://localhost:5000/api";

export interface Room {
    _id: string;
    name: string;
    capacity: number;
}

export interface Booking {
    _id: string;
    roomId: string;
    title: string;
    organizerEmail: string;
    attendees: string[];
    start: string;
    end: string;
}

export interface Draft {
    roomId: string;
    date: string;
    start: string;
    end: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data as T;
}

export const getRooms = () => request<Room[]>("/room");

export const getBookings = () => request<Booking[]>("/booking");

export const createBooking = (body: Omit<Booking, "_id">) =>
    request<Booking>("/booking", { method: "POST", body: JSON.stringify(body) });

export const deleteBooking = (id: string) =>
    request<{ message: string }>(`/booking/${id}`, { method: "DELETE" });

export const getAvailability = (
    date: string,
    start: string,
    end: string,
    minCapacity?: number
) => {
    const params = new URLSearchParams({ date, start, end });
    if (minCapacity) params.append("minCapacity", String(minCapacity));
    return request<Room[]>(`/booking/availability?${params}`);
};