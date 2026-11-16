import { useState, useRef } from "react";
import { Star, Trash2, Image as ImageIcon, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { useProImage } from "@/service/proImage/proImage.queries";
import type { ProImageListDto } from "@/types/productImage";

function ProImageThumb({ id, className }: { id: string; className?: string }) {
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

// ── Add Image Modal ───────────────────────────────────────────────────────────
interface AddImageModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (file: File, isMain: boolean) => void;
  uploading: boolean;
  hasMain: boolean;
}

function AddImageModal({
  open,
  onClose,
  onAdd,
  uploading,
  hasMain,
}: AddImageModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isMain, setIsMain] = useState(!hasMain);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setIsMain(!hasMain);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  };

  const handleAdd = () => {
    if (!file) return;
    onAdd(file, isMain);
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-brown-900">Add Image</h3>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Upload zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            file
              ? "border-yellow-400 bg-yellow-50/30"
              : "border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/20"
          }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="max-h-40 rounded-lg object-contain"
            />
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-500">Click to select an image</p>
            </>
          )}
          {file && <p className="text-xs text-slate-400 mt-1">{file.name}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Set as main — single checkbox */}
        <label
          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
            isMain
              ? "border-yellow-500 bg-yellow-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <input
            type="checkbox"
            checked={isMain}
            onChange={(e) => setIsMain(e.target.checked)}
            className="w-4 h-4 accent-yellow-500"
          />
          <div>
            <p className="text-sm font-medium text-brown-900">
              Set as main image
            </p>
            <p className="text-xs text-slate-400">
              Shown as the primary product image
            </p>
          </div>
        </label>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex-1 border-brown-300 text-brown-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!file || uploading}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
          >
            {uploading ? "Uploading…" : "Add Image"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface ProductImageManagerProps {
  productId: string;
  images: ProImageListDto[];
  onAdd: (file: File, isMain: boolean) => void;
  onDelete: (id: string) => void;
  onSetMain: (id: string) => void;
  uploading: boolean;
}

export function ProductImageManager({
  productId,
  images,
  onAdd,
  onDelete,
  onSetMain,
  uploading,
}: ProductImageManagerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const mainImage = images.find((i) => i.isMainStr === "Yes") ?? images[0];
  const displayedId = selectedId ?? mainImage?.id;
  const hasMain = images.some((i) => i.isMainStr === "Yes");

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* Left — main image */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 aspect-square">
          {images.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p className="text-sm">No images yet</p>
            </div>
          ) : (
            <>
              {displayedId && (
                <ProImageThumb
                  id={displayedId}
                  className="w-full h-full object-contain p-4 transition-opacity duration-300"
                />
              )}
              {images.find((img) => img.id === displayedId)?.isMainStr ===
                "Yes" && (
                <span className="absolute top-3 left-3 text-xs bg-yellow-500 text-brown-900 px-2 py-0.5 rounded-full font-semibold">
                  Main
                </span>
              )}
            </>
          )}
        </div>

        {/* Right — thumbnail grid + add button */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 flex-1">
            {images.slice(0, 5).map((img) => (
              <div key={img.id} className="relative group aspect-square">
                <button
                  type="button"
                  onClick={() => setSelectedId(img.id)}
                  className={`w-full h-full overflow-hidden rounded-xl border-2 transition-all bg-slate-50 ${
                    displayedId === img.id
                      ? "border-yellow-500 shadow-md"
                      : "border-slate-200 hover:border-yellow-300"
                  }`}
                >
                  <ProImageThumb
                    id={img.id}
                    className="w-full h-full object-contain"
                  />
                </button>
                {img.isMainStr === "Yes" && (
                  <span className="absolute top-0.5 left-0.5 text-[9px] bg-yellow-500 text-brown-900 px-1 py-px rounded font-semibold leading-none pointer-events-none">
                    ★
                  </span>
                )}
                <div className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-1.5">
                  {img.isMainStr !== "Yes" && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="Set as main"
                      onClick={() => onSetMain(img.id)}
                      className="h-7 w-7 rounded-full bg-white/95 text-yellow-600 shadow-sm border border-yellow-100 hover:bg-yellow-50 hover:text-yellow-700"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    title="Delete"
                    onClick={() => onDelete(img.id)}
                    className="h-7 w-7 rounded-full bg-white/95 text-red-500 shadow-sm border border-red-100 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setAddOpen(true)}
            disabled={uploading}
            className="w-full border-dashed border-slate-300 text-slate-500 hover:border-yellow-400 hover:text-yellow-700 hover:bg-yellow-50/20"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            {uploading ? "Uploading…" : "Add Image"}
          </Button>
        </div>
      </div>

      <AddImageModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(file, isMain) => {
          onAdd(file, isMain);
          setAddOpen(false);
        }}
        uploading={uploading}
        hasMain={hasMain}
      />
      <span className="hidden" data-product={productId} />
    </>
  );
}
