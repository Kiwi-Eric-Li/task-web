const NZ_TZ = "Pacific/Auckland";

export function formatSinceNow(input) {
    if (!input) return ''
    const then = new Date(input).getTime()
    if (Number.isNaN(then)) return ''
    const diff = Math.max(0, Date.now() - then)
    const s = Math.floor(diff / 1000)
    if (s < 30) return 'just now'
    const m = Math.floor(s / 60)
    if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`
    const w = Math.floor(d / 7)
    if (w < 5) return `${w} week${w === 1 ? '' : 's'} ago`
    const mo = Math.floor(d / 30)
    if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
    const y = Math.floor(d / 365)
    return `${y} year${y === 1 ? '' : 's'} ago`
}

export const pad2 = (n) => String(n).padStart(2, "0");

export const formatHHmm = (iso, timeZone) =>
    iso
        ? new Intl.DateTimeFormat("en-NZ", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(iso)) // 'iso' assumed UTC/GMT; Date handles that
        : "";

export const formatDateNZ = (iso, opts) => {
    if (!iso) return "";

    const options =
        typeof opts === "string" ? { timeZone: opts } : opts ?? {};
    const timeZone = options.timeZone ?? NZ_TZ;

    const dateStr = new Intl.DateTimeFormat("en-NZ", {
        timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(iso));

    if (!options.withTime) return dateStr;

    const timeStr = formatHHmm(iso, timeZone);
    return timeStr ? `${dateStr} ${timeStr}` : dateStr;
};

const toTzDateKey = (d, timeZone = NZ_TZ) => {
    const parts = new Intl.DateTimeFormat("en-NZ", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(d);

    const y = parts?.find(p => p.type === "year")?.value;
    const m = parts?.find(p => p.type === "month")?.value;
    const day = parts?.find(p => p.type === "day")?.value;
    return `${y}-${m}-${day}`;
};

const yesterdayKey = (now, timeZone = NZ_TZ) => {
    // Get "today" (Y, M, D) as seen in the target TZ
    const parts = new Intl.DateTimeFormat("en-NZ", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);

    let y = Number(parts.find(p => p.type === "year")?.value);
    let m = Number(parts.find(p => p.type === "month")?.value);
    let d = Number(parts.find(p => p.type === "day")?.value);

    // Roll one day back in calendar terms
    if (d > 1) {
        d -= 1;
    } else {
        // Move to previous month
        if (m === 1) {
            m = 12;
            y -= 1;
        } else {
            m -= 1;
        }
        // Days in month for (y, m)
        d = new Date(Date.UTC(y, m, 0)).getUTCDate(); // m is 1-12, day 0 = last day of prev month
    }
    return `${y}-${pad2(m)}-${pad2(d)}`;
};

export const isSameDay = (a, b, timeZone= NZ_TZ) => {
    if (!a || !b) return false;
    return toTzDateKey(a, timeZone) === toTzDateKey(b, timeZone);
};

export const isYesterday = (d, now = new Date(), timeZone = NZ_TZ) =>
    toTzDateKey(d, timeZone) === yesterdayKey(now, timeZone);

export const formatInboxTime = (iso, now, timeZone=NZ_TZ) => {
    if (!iso) return "";
    const d = new Date(iso);
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60 && diffSec >= -5) return "Just now";
    if (isSameDay(d, now, timeZone)) return formatHHmm(iso, timeZone);
    if (isYesterday(d, now, timeZone)) return "Yesterday";
    return new Intl.DateTimeFormat("en-NZ", {
        timeZone,
        day: "2-digit",
        month: "2-digit",
    }).format(d);
};