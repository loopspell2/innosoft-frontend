import { useState, type FormEvent } from "react";
import { createBooking, type Draft, type Room } from "../api";
import { toUtcIso } from "../time";
import { buttonClass, inputClass } from "../ui";

interface Props {
    rooms: Room[];
    initial: Draft;
    onCreated: () => void;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingForm = ({ rooms, initial, onCreated }: Props) => {
    const [roomId, setRoomId] = useState(initial.roomId);
    const [title, setTitle] = useState("");
    const [organizerEmail, setOrganizerEmail] = useState("");
    const [attendees, setAttendees] = useState("");
    const [date, setDate] = useState(initial.date);
    const [start, setStart] = useState(initial.start);
    const [end, setEnd] = useState(initial.end);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!roomId) e.roomId = "Please select a room";
        if (!title.trim()) e.title = "Title is required";
        if (!emailRe.test(organizerEmail)) e.organizerEmail = "Enter a valid email";

        const count = Number(attendees);
        if (!Number.isInteger(count) || count < 1) {
            e.attendees = "Attendees must be a whole number of at least 1";
        }

        if (!date) e.date = "Pick a date";
        if (!start) e.start = "Pick a start time";
        if (!end) e.end = "Pick an end time";
        if (start && end && start >= end) e.end = "End time must be after start time";
        return e;
    };

    const handleSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        setServerError("");
        setSuccess("");

        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setSaving(true);
        try {
            await createBooking({
                roomId,
                title: title.trim(),
                organizerEmail,
                attendees: Number(attendees),
                start: toUtcIso(date, start),
                end: toUtcIso(date, end),
            });
            setSuccess("Booking created.");
            setTitle("");
            setAttendees("");
            onCreated();
        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // props shared by every input for accessibility
    const a11y = (id: string) => ({
        id,
        "aria-invalid": errors[id] ? true : undefined,
        "aria-describedby": errors[id] ? `${id}-error` : undefined,
    });

    const ErrorText = ({ id }: { id: string }) =>
        errors[id] ? <p id={`${id}-error`} className="text-sm text-red-600">{errors[id]}</p> : null;

    return (
        <section id="book-form" aria-labelledby="book-heading" className="mb-8 max-w-lg">
            <h2 id="book-heading" className="text-xl font-semibold mb-2">Create booking</h2>

            <form onSubmit={handleSubmit} noValidate>
                {Object.keys(errors).length > 0 && (
                    <p role="alert" className="text-red-600 mb-2">Please fix the errors below.</p>
                )}
                {serverError && (
                    <p role="alert" className="text-red-600 mb-2">Server error: {serverError}</p>
                )}
                {success && <p role="status" className="text-green-700 mb-2">{success}</p>}

                <div className="mb-3">
                    <label htmlFor="roomId" className="block text-sm font-medium">Room</label>
                    <select {...a11y("roomId")} className={inputClass} value={roomId} onChange={e => setRoomId(e.target.value)}>
                        <option value="">Select a room</option>
                        {rooms.map(r => (
                            <option key={r._id} value={r._id}>{r.name} (capacity {r.capacity})</option>
                        ))}
                    </select>
                    <ErrorText id="roomId" />
                </div>

                <div className="mb-3">
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input {...a11y("title")} className={inputClass} value={title} onChange={e => setTitle(e.target.value)} />
                    <ErrorText id="title" />
                </div>

                <div className="mb-3">
                    <label htmlFor="organizerEmail" className="block text-sm font-medium">Organizer email</label>
                    <input {...a11y("organizerEmail")} type="email" className={inputClass} value={organizerEmail} onChange={e => setOrganizerEmail(e.target.value)} />
                    <ErrorText id="organizerEmail" />
                </div>

                <div className="mb-3">
                    <label htmlFor="attendees" className="block text-sm font-medium">Attendees</label>
                    <input {...a11y("attendees")} type="number" min="1" step="1" className={inputClass} value={attendees} onChange={e => setAttendees(e.target.value)} />
                    <ErrorText id="attendees" />
                </div>

                <div className="mb-3">
                    <label htmlFor="date" className="block text-sm font-medium">Date (UTC)</label>
                    <input {...a11y("date")} type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} />
                    <ErrorText id="date" />
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                        <label htmlFor="start" className="block text-sm font-medium">Start (UTC)</label>
                        <input {...a11y("start")} type="time" className={inputClass} value={start} onChange={e => setStart(e.target.value)} />
                        <ErrorText id="start" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="end" className="block text-sm font-medium">End (UTC)</label>
                        <input {...a11y("end")} type="time" className={inputClass} value={end} onChange={e => setEnd(e.target.value)} />
                        <ErrorText id="end" />
                    </div>
                </div>

                <button type="submit" className={buttonClass} disabled={saving}>
                    {saving ? "Saving..." : "Create booking"}
                </button>
            </form>
        </section>
    );
};

export default BookingForm;