import { useEffect, useState } from "react";

/** RFC1123: "Fri, 15 Aug 2025 23:34:25 GMT" → UTC ms */
function parseRfc1123UtcMs(s) {
  const match = s.trim().match(
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+GMT$/i
  );
  if (!match) return null;

  const day = parseInt(match[2], 10);
  const monStr = match[3].toLowerCase();
  const month = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(monStr);
  const year = parseInt(match[4], 10);
  const hour = parseInt(match[5], 10);
  const minute = parseInt(match[6], 10);
  const second = parseInt(match[7], 10);

  if (month < 0) return null;

  const ms = Date.UTC(year, month, day, hour, minute, second);
  return Number.isNaN(ms) ? null : ms;
}

/** SQL-like: "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DDTHH:mm:ss" → based on UTC */
function parseSqlLikeUtcMs(s) {
  const match = s.trim().match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/
  );
  if (!match) return null;

  const [, Y, Mo, D, h, mi, se] = match;
  const ms = Date.UTC(
    parseInt(Y, 10),
    parseInt(Mo, 10) - 1,
    parseInt(D, 10),
    parseInt(h, 10),
    parseInt(mi, 10),
    parseInt(se, 10)
  );
  return Number.isNaN(ms) ? null : ms;
}

/** Uniformly convert expiresAt to UTC timestamps（ms） */
export function toEpochMs(expiresAt) {
  if (expiresAt == null) return null;
  if (typeof expiresAt === "number") return isFinite(expiresAt) ? expiresAt : null;
  if (expiresAt instanceof Date) return isFinite(expiresAt.getTime()) ? expiresAt.getTime() : null;

  if (typeof expiresAt === "string") {
    const s = expiresAt.trim();

    // 1) Native parsing
    const tNative = Date.parse(s);
    if (!Number.isNaN(tNative)) return tNative;

    // 2) RFC1123 (… GMT) → UTC
    const tRfc = parseRfc1123UtcMs(s);
    if (tRfc != null) return tRfc;

    // 3) SQL-like time zone string → as UTC parsing
    const tSql = parseSqlLikeUtcMs(s);
    if (tSql != null) return tSql;

    return null;
  }
  return null;
}

/** Format in the local time zone (customizable locale/timeZone) */
export function formatLocalDateTime( value, locale, options) {
  const ms = toEpochMs(value);
  if (ms == null) return "";
  return new Date(ms).toLocaleString(
    locale,
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      ...options,
    }
  );
}

/** Calculate the remaining milliseconds (not negative) */
export function calcMsLeft(targetMs) {
  return Math.max(0, targetMs - Date.now());
}

/** "Hh MMm SSs left" 或 "Expired" */
export function formatHmsLeft(msLeft) {
  if (msLeft <= 0) return "Expired";
  const totalSec = Math.floor(msLeft / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${hours}h ${pad(minutes)}m ${pad(seconds)}s left`;
}

/** Each tickMs refreshes the countdown once */
export function useCountdown( expiresAt, opts) {
  const targetMs = toEpochMs(expiresAt);
  const [msLeft, setMsLeft] = useState(() => (targetMs ? calcMsLeft(targetMs) : 0));
  const tickMs = opts?.tickMs ?? 1000;

  useEffect(() => {
    if (!targetMs) {
      setMsLeft(0);
      return;
    }
    const update = () => setMsLeft(calcMsLeft(targetMs));
    update();
    const id = window.setInterval(update, tickMs);
    return () => window.clearInterval(id);
  }, [targetMs, tickMs]);

  return {
    msLeft,
    isExpired: msLeft <= 0,
    display: formatHmsLeft(msLeft),
    targetMs,
  };
}
