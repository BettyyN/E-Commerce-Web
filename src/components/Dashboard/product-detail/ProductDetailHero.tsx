import { useState } from "react";
import { useProImages, useProImage } from "@/service/proImage/proImage.queries";
import { Image as ImageIcon } from "lucide-react";

function Thumb({ id, className }: { id: string; className?: string }) {
  const { data: url } = useProImage(id);
  if (!url) {
    return (
      <div
        className={`${className ?? ""} bg-slate-100 flex items-center justify-center text-slate-300`}
      >
        <ImageIcon className="h-5 w-5" />
      </div>
    );
  }
  return <img src={url} alt="Product" className={className} />;
}

export function ProductDetailHero({ productId }: { productId: string }) {
  const { data: images = [] } = useProImages(productId);
  const [selectedImage, setSelectedImage] = useState(0);

  const mainImage =
    images.find((i) => i.isMainStr === "Yes") ?? images[0] ?? null;
  const ordered = mainImage
    ? [mainImage, ...images.filter((i) => i.id !== mainImage.id)]
    : [];

  const current = ordered[Math.min(selectedImage, ordered.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 h-96">
        {ordered.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm text-slate-400">No images</p>
          </div>
        ) : (
          current && (
            <Thumb
              id={current.id}
              className="w-full h-full object-contain p-6 transition-opacity duration-300"
            />
          )
        )}
      </div>

      {/* Thumbnails */}
      {ordered.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {ordered.slice(0, 4).map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(idx)}
              className={`overflow-hidden rounded-xl border-2 transition-all h-20 bg-slate-50 ${
                selectedImage === idx
                  ? "border-yellow-500 shadow-md"
                  : "border-transparent hover:border-yellow-300"
              }`}
            >
              <Thumb
                id={img.id}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
