"use client";

import { useState } from "react";
import { id } from "@instantdb/core";

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    day: string;
    startTime: string;
    endTime?: string;
    location?: string;
    locationUrl?: string;
    description?: string;
    group: string;
    sortOrder: number;
  } | null;
  onClose: () => void;
}

type DayKey = "friday" | "saturday" | "sunday";
type GroupKey = "all" | "family" | "wedding-party";

export function EventForm({ event, onClose }: EventFormProps) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [day, setDay] = useState<DayKey>((event?.day as DayKey) ?? "friday");
  const [startTime, setStartTime] = useState(event?.startTime ?? "");
  const [endTime, setEndTime] = useState(event?.endTime ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [locationUrl, setLocationUrl] = useState(event?.locationUrl ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [group, setGroup] = useState<GroupKey>(
    (event?.group as GroupKey) ?? "all",
  );
  const [sortOrder, setSortOrder] = useState(event?.sortOrder ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !startTime) {
      setError("Title and start time are required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { db } = await import("@/lib/instant/db");
      const data = {
        title,
        day,
        startTime,
        endTime: endTime || undefined,
        location: location || undefined,
        locationUrl: locationUrl || undefined,
        description: description || undefined,
        group,
        sortOrder,
      };

      if (event?.id) {
        await db.transact(db.tx.scheduleEvents[event.id].update(data));
      } else {
        await db.transact(db.tx.scheduleEvents[id()].create(data));
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    backgroundColor: "var(--color-bg)",
    border: "1px solid var(--color-border-gold)",
    color: "var(--color-text)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div className="md:col-span-2">
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Day *
        </label>
        <select
          value={day}
          onChange={(e) => setDay(e.target.value as DayKey)}
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
        >
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
      </div>

      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Sort Order
        </label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
        />
      </div>

      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Start Time *
        </label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="6:00 PM"
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          End Time
        </label>
        <input
          type="text"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="8:00 PM"
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
        />
      </div>

      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
        />
      </div>

      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Location URL
        </label>
        <input
          type="url"
          value={locationUrl}
          onChange={(e) => setLocationUrl(e.target.value)}
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
        />
      </div>

      <div className="md:col-span-2">
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Visible To
        </label>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value as GroupKey)}
          className="w-full rounded px-4 py-2.5 text-sm"
          style={inputStyle}
        >
          <option value="all">All Guests</option>
          <option value="family">Family</option>
          <option value="wedding-party">Wedding Party</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded px-4 py-2.5 text-sm resize-none"
          style={inputStyle}
        />
      </div>

      {error && (
        <div className="md:col-span-2">
          <p className="text-sm" style={{ color: "var(--color-red)" }}>
            {error}
          </p>
        </div>
      )}

      <div className="md:col-span-2 flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded px-5 py-2.5 text-sm tracking-wide transition-opacity hover:opacity-70"
          style={{
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded px-5 py-2.5 text-sm tracking-wide transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-gold)",
            color: "var(--color-bg)",
          }}
        >
          {submitting ? "Saving…" : event?.id ? "Update Event" : "Add Event"}
        </button>
      </div>
    </form>
  );
}
