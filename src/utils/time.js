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
