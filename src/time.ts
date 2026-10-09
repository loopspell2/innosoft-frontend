// time.ts
export const BUSINESS_START = 9;   // 09:00 UTC
export const BUSINESS_END = 18;    // 18:00 UTC

export const todayUtc = () => new Date().toISOString().slice(0, 10);

export const toUtcIso = (date: string, time: string) => `${date}T${time}:00.000Z`;

export const formatTime = (iso: string) => new Date(iso).toISOString().slice(11, 16);

export const businessWindow = (date: string): [Date, Date] => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return [
        new Date(`${date}T${pad(BUSINESS_START)}:00:00.000Z`),
        new Date(`${date}T${pad(BUSINESS_END)}:00:00.000Z`),
    ];
};