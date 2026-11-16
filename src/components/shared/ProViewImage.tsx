import { useProViewImage, useProViewImages } from "@/service/proView/proView.queries";
import type { ReactNode } from "react";

// "/api/item/image/<uuid>" -> "<uuid>"
export function extractImageId(url?: string | null,  ) {
  const parts = (url ?? "").split("/");
  return parts[parts.length - 1] ?? "";
}

interface ProViewImageProps {
  url?: string | null;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallback?: ReactNode;
}

export function ProViewImage({
  url,
  alt = "",
  className,
  loading,
}: ProViewImageProps) {
  const imgId = extractImageId(url, );
  const { data: blobUrl } = useProViewImage(imgId || undefined);

  // Blob once loaded, raw url as a fallback while loading
  const src = blobUrl ?? url ?? undefined;
  if (!src) return null;

  return <img src={src} alt={alt} className={className} loading={loading} />;
}

export function ProViewImages({
  url,
  alt = "",
  className,
  loading,
}: ProViewImageProps) {
  const imgId = extractImageId(url);
  const { data: blobUrl } = useProViewImages(imgId || undefined);

  // Blob once loaded, raw url as a fallback while loading
  const src = blobUrl ?? url ?? undefined;
  if (!src) return null;

  return <img src={src} alt={alt} className={className} loading={loading} />;
}

