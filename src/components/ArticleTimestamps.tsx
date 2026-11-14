"use client";

import { useEffect, useState } from "react";

const SIX_HOURS = 6 * 60 * 60 * 1000;
const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

function clock(date: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" })
    .format(date)
    .replace(/\s*AM$/i, " a.m.")
    .replace(/\s*PM$/i, " p.m.");
}

function calendarDay(date: Date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

export function timestampText(value: string, now: Date) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  const age = now.valueOf() - date.valueOf();

  if (age >= 0 && age < SIX_HOURS) {
    const minutes = Math.floor(age / 60_000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min. ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr${hours === 1 ? "." : "s."} ago`;
  }

  const time = clock(date);
  return sameDay(date, now) && now.getHours() < 23 ? time : `${calendarDay(date)} at ${time}`;
}

export function ArticleTimestamps({ publishedAt, updatedAt }: { publishedAt: string; updatedAt?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <span className="article-timestamps" aria-hidden="true" />;

  const published = timestampText(publishedAt, now);
  const updatedDate = updatedAt ? new Date(updatedAt) : null;
  const publishedDate = new Date(publishedAt);
  const hasMeaningfulUpdate = updatedDate
    && !Number.isNaN(updatedDate.valueOf())
    && updatedDate.valueOf() - publishedDate.valueOf() >= 60_000;
  const updated = hasMeaningfulUpdate ? timestampText(updatedAt!, now) : null;

  return <span className="article-timestamps">
    {published ? <time dateTime={publishedAt}>Published {published}</time> : null}
    {updated ? <time dateTime={updatedAt}>Updated {updated}</time> : null}
  </span>;
}
