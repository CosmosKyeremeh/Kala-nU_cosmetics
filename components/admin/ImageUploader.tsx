"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images per product");
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) uploaded.push(data.url);
      else toast.error(data.error ?? "Upload failed");
    }
    setUploading(false);
    onChange([...images, ...uploaded]);
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-rose-light bg-rose-light/5 p-6 text-center text-sm text-slate hover:border-rose-primary"
      >
        {uploading ? "Uploading..." : "Drag & drop images here, or click to select (up to 5)"}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={src} className="relative h-20 w-20 overflow-hidden rounded-lg border border-rose-light/40">
              <Image src={src} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
