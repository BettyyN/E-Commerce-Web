import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import {  ProViewImages } from "@/components/shared/ProViewImage";
import type { ProImageList } from "@/types/proView";

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`${className ?? ""} bg-slate-100 flex items-center justify-center text-slate-300`}
    >
      <ImageIcon className="h-5 w-5" />
    </div>
  );
}

interface CustomerProductHeroProps {
  images: ProImageList[];
}

export function CustomerProductHero({ images }: CustomerProductHeroProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const ordered = [
    ...images.filter((i) => i.isMain),
    ...images.filter((i) => !i.isMain),
  ];

  const current = ordered[Math.min(selectedIdx, ordered.length - 1)];

  if (!ordered.length) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 h-96 flex flex-col items-center justify-center text-slate-300">
          <ImageIcon className="h-10 w-10 mb-2" />
          <p className="text-sm text-slate-400">No images</p>
        </div>
      </div>
    );
  }

  const mainClass =
    "w-full h-full object-contain p-6 transition-opacity duration-300";
  const thumbClass = "w-full h-full object-contain";

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 h-96">
        <ProViewImages
          url={current.url}
          alt="Product"
          className={mainClass}
          fallback={<ImagePlaceholder className={mainClass} />}
        />
      </div>

      {/* Thumbnails */}
      {ordered.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {ordered.slice(0, 4).map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              onClick={() => setSelectedIdx(idx)}
              className={`overflow-hidden rounded-xl border-2 transition-all h-20 bg-slate-50 ${
                selectedIdx === idx
                  ? "border-yellow-500 shadow-md"
                  : "border-transparent hover:border-yellow-300"
              }`}
            >
              <ProViewImages
                url={img.url}
                alt="Product"
                className={thumbClass}
                fallback={<ImagePlaceholder className={thumbClass} />}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
