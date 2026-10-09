import { useCallback, useEffect, useState } from "react";
import { deleteBooking, getBookings, getRooms, type Booking, type Room, type Draft } from "./api";
import { todayUtc } from "./time";
import DayView from "./component/DayView";
import FindRoom from "./component/FindRoom";
import BookingForm from "./component/BookingForm";

const App = () => {
    const [date, setDate] = useState(todayUtc());
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [draft, setDraft] = useState<Draft>({ roomId: "", date: todayUtc(), start: "", end: "" });
    const [formKey, setFormKey] = useState(0);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [r, b] = await Promise.all([getRooms(), getBookings()]);
            setRooms(r);
            setBookings(b);
        } catch (err: any) {
            setError(err.message || "Could not load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCancel = async (id: string) => {
        await deleteBooking(id);   // DayView catches the error and shows it
        await loadData();
    };

    const handleBookFromSearch = (d: Draft) => {
        setDraft(d);
        setFormKey(k => k + 1);
        setTimeout(() => {
            document.getElementById("book-form")?.scrollIntoView();
            document.getElementById("roomId")?.focus();
        }, 0);
    };

    return (
        <main className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Room Booking</h1>

            <DayView
                rooms={rooms}
                bookings={bookings}
                date={date}
                onDateChange={setDate}
                loading={loading}
                error={error}
                onRetry={loadData}
                onCancel={handleCancel}
            />

            <FindRoom defaultDate={date} onBook={handleBookFromSearch} />

            <BookingForm key={formKey} rooms={rooms} initial={draft} onCreated={loadData} />
        </main>
    );
};

export default App;