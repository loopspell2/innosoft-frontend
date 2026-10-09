import { useState } from "react";
import type { FormEvent } from "react";
import { getAvailability } from "../api";
import type { Draft, Room } from "../api";
import { buttonClass, inputClass, smallButtonClass } from "../ui";

interface Props {
    defaultDate: string;
    onBook: (draft: Draft) => void;
}

const FindRoom = ({ defaultDate, onBook }: Props) => {
    const [date, setDate] = useState(defaultDate);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [minCapacity, setMinCapacity] = useState("");

    const [rooms, setRooms] = useState<Room[] | null>(null);   // null = not searched yet
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (ev: FormEvent) => {
        ev.preventDefault();
        setError("");

        if (!date || !start || !end) {
            setError("Please fill date, start and end.");
            return;
        }
        if (start >= end) {
            setError("End time must be after start time.");
            return;
        }

        setLoading(true);
        try {
            const data = await getAvailability(date, start, end, minCapacity ? Number(minCapacity) : undefined);
            setRooms(data);
        } catch (err: any) {
            setError(err.message);
            setRooms(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section aria-labelledby="find-heading" className="mb-8 max-w-lg">
            <h2 id="find-heading" className="text-xl font-semibold mb-2">Find a room</h2>

            <form onSubmit={handleSearch} noValidate>
                <div className="mb-3">
                    <label htmlFor="find-date" className="block text-sm font-medium">Date (UTC)</label>
                    <input id="find-date" type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                        <label htmlFor="find-start" className="block text-sm font-medium">Start (UTC)</label>
                        <input id="find-start" type="time" className={inputClass} value={start} onChange={e => setStart(e.target.value)} />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="find-end" className="block text-sm font-medium">End (UTC)</label>
                        <input id="find-end" type="time" className={inputClass} value={end} onChange={e => setEnd(e.target.value)} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="find-cap" className="block text-sm font-medium">Minimum capacity</label>
                    <input id="find-cap" type="number" min="1" className={inputClass} value={minCapacity} onChange={e => setMinCapacity(e.target.value)} />
                </div>
                <button type="submit" className={buttonClass} disabled={loading}>
                    {loading ? "Searching..." : "Find rooms"}
                </button>
            </form>

            {error && <p role="alert" className="text-red-600 mt-2">{error}</p>}

            <div aria-live="polite" className="mt-3">
                {rooms && rooms.length === 0 && <p>No rooms available for this time.</p>}
                {rooms && rooms.length > 0 && (
                    <ul>
                        {rooms.map(r => (
                            <li key={r._id} className="flex items-center gap-2 py-1 border-t border-gray-200">
                                <span>{r.name} (capacity {r.capacity})</span>
                                <button
                                    className={smallButtonClass}
                                    aria-label={`Book ${r.name}`}
                                    onClick={() => onBook({ roomId: r._id, date, start, end })}
                                >
                                    Book this room
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default FindRoom;