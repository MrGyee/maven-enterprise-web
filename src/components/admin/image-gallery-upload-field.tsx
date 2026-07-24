"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/lib/data/types";

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Upload failed");
  }
  const body = (await res.json()) as { url: string };
  return body.url;
}

export function ImageGalleryUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ImageAsset[];
  onChange: (images: ImageAsset[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => ({
          url: await uploadFile(file),
          alt: label,
        }))
      );
      onChange([...value, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((image, index) => (
          <div key={image.url + index} className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <Image src={image.url} alt={image.alt} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-center transition-colors",
            isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="size-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add images</span>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
