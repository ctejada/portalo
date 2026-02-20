"use client";

import { useState } from "react";

interface DateRangePickerProps {
  onRangeChange: (startDate: string, endDate: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function DateRangePicker({ onRangeChange, onClear, disabled }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 365);
  const minStr = minDate.toISOString().split("T")[0];

  function handleApply() {
    if (startDate && endDate && startDate <= endDate) {
      onRangeChange(startDate, endDate);
    }
  }

  function handleClear() {
    setStartDate("");
    setEndDate("");
    onClear();
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        min={minStr}
        max={today}
        disabled={disabled}
        className="px-2 py-1 text-small border border-border-primary rounded bg-bg-primary text-text-primary"
        aria-label="Start date"
      />
      <span className="text-text-tertiary text-small">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={startDate || minStr}
        max={today}
        disabled={disabled}
        className="px-2 py-1 text-small border border-border-primary rounded bg-bg-primary text-text-primary"
        aria-label="End date"
      />
      <button
        onClick={handleApply}
        disabled={disabled || !startDate || !endDate || startDate > endDate}
        className="px-2 py-1 text-small bg-accent text-text-inverse rounded disabled:opacity-40 transition-colors"
      >
        Apply
      </button>
      {(startDate || endDate) && (
        <button
          onClick={handleClear}
          className="px-2 py-1 text-small text-text-secondary hover:text-text-primary transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
