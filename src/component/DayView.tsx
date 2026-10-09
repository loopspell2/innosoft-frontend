import { useState } from "react";
import type { Booking, Room } from "../api";
import { BUSINESS_END, BUSINESS_START, businessWindow, formatTime } from "../time";
import { inputClass, smallButtonClass } from "../ui";

interface Props {
    rooms: Room[];
    bookings: Booking[];
    date: string;
    onDateChange: (d: string) => void;
    loading: boolean;
    error: string;
    onRetry: () => void;
    onCancel: (id: string) => Promise<void>;
}

const DayView = ({ rooms, bookings, date, onDateChange, loading, error, onRetry, onCancel }: Props) => {
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [cancelError, setCancelError] = useState("");
    const [cancelling, setCancelling] = useState(false);

    const [winStart, winEnd] = businessWindow(date);

    const bookingsFor = (roomId: string) =>
        bookings
            .filter(b => b.roomId === roomId && new Date(b.start) < winEnd && new Date(b.end) > winStart)
            .sort((a, b) => a.start.localeCompare(b.start));

    const handleConfirm = async (id: string) => {
        setCancelling(true);
        setCancelError("");
        try {
            await onCancel(id);
            setConfirmId(null);
        } catch (err: any) {
            setCancelError(err.message);
        } finally {
            setCancelling(false);
        }
    };

    return (
        <section aria-labelledby="day-heading" className="mb-8">
            <h2 id="day-heading" className="text-xl font-semibold mb-2">Day view</h2>

            <div className="mb-3 max-w-xs">
                <label htmlFor="day-date" className="block text-sm font-medium">Date (UTC)</label>
                <input
                    id="day-date"
                    type="date"
                    className={inputClass}
                    value={date}
                    onChange={e => onDateChange(e.target.value)}
                />
            </div>

            <p className="text-sm text-gray-600 mb-3">
                Business hours: {BUSINESS_START}:00 – {BUSINESS_END}:00 UTC. All times are UTC.
            </p>

            {cancelError && (
                <p role="alert" className="text-red-600 mb-2">Could not cancel: {cancelError}</p>
            )}

            {loading && <p role="status">Loading schedule...</p>}

            {error && !loading && (
                <div role="alert" className="text-red-600">
                    <p>{error}</p>
                    <button onClick={onRetry} className={smallButtonClass}>Try again</button>
                </div>
            )}

            {!loading && !error && rooms.length === 0 && <p>No rooms found.</p>}

            {!loading && !error && rooms.map(room => {
                const list = bookingsFor(room._id);
                return (
                    <div key={room._id} className="border border-gray-300 rounded p-3 mb-3">
                        <h3 className="font-medium">
                            {room.name} <span className="text-sm text-gray-600">(capacity {room.capacity})</span>
                        </h3>

                        {list.length === 0 ? (
                            <p className="text-sm text-gray-600">No bookings for this day.</p>
                        ) : (
                            <ul>
                                {list.map(b => (
                                    <li key={b._id} className="flex flex-wrap items-center gap-2 py-1 border-t border-gray-200">
                                        <span>
                                            {formatTime(b.start)} – {formatTime(b.end)} UTC · {b.title} ({b.organizerEmail})
                                        </span>

                                        {confirmId === b._id ? (
                                            <span role="group" aria-label="Confirm cancel" className="flex items-center gap-2">
                                                <span>Cancel this booking?</span>
                                                <button
                                                    className={smallButtonClass}
                                                    onClick={() => handleConfirm(b._id)}
                                                    disabled={cancelling}
                                                >
                                                    {cancelling ? "Cancelling..." : "Yes, cancel"}
                                                </button>
                                                <button className={smallButtonClass} onClick={() => setConfirmId(null)}>
                                                    No
                                                </button>
                                            </span>
                                        ) : (
                                            <button
                                                className={smallButtonClass}
                                                aria-label={`Cancel booking ${b.title}`}
                                                onClick={() => { setConfirmId(b._id); setCancelError(""); }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </section>
    );
};

export default DayView;