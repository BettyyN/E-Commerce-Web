import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatETB(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const toUtcIso = (dateStr: string) =>
  dateStr ? new Date(`${dateStr}T00:00:00.000Z`).toISOString() : null;

// Turn an ISO datetime back into the `YYYY-MM-DD` a date input needs.
export const toDateInput = (iso: string | null | undefined) =>
  iso?.split("T")[0] ?? "";

export const BTN_PRIMARY =
  "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900";
export const BTN_OUTLINE = "border-brown-300 text-brown-700";