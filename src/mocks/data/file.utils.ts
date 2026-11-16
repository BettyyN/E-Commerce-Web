import { HttpResponse } from "msw";

export const money = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatBytes = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1024 * 1024
      ? `${(n / 1024).toFixed(1)} KB`
      : `${(n / 1024 / 1024).toFixed(1)} MB`;

export const svgPlaceholder = (label: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" rx="24" fill="${color}"/><text x="120" y="150" font-size="96" font-family="sans-serif" text-anchor="middle" fill="white">${label}</text></svg>`,
  )}`;

export const fileToDataUri = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return `data:${file.type || "application/octet-stream"};base64,${btoa(binary)}`;
};

// Turns a stored data URI back into a real file response
export const dataUriResponse = async (dataUri: string) => {
  const blob = await (await fetch(dataUri)).blob();
  return new HttpResponse(blob, {
    headers: { "Content-Type": blob.type || "application/octet-stream" },
  });
};
