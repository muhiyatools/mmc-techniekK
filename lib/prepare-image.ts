"use client";

/**
 * Photos come straight off a phone or camera: 4–12 MB and 4000+ pixels wide. The
 * server only ever needs 2400px, and a smaller file uploads faster on a phone.
 * Decoding and re-drawing through a canvas also drops EXIF (including GPS) already
 * in the browser; the server re-encodes once more as the final guarantee.
 */
const MAX_EDGE = 2400;
const SHRINK_ABOVE_BYTES = 3 * 1024 * 1024;

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await decode(file);
  if (!bitmap) return file;
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= SHRINK_ABOVE_BYTES) return file;

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);

    // PNG keeps transparency, everything else becomes WebP (also supports alpha and
    // is much smaller); browsers without a WebP encoder fall back to JPEG.
    const png = file.type === "image/png";
    const blob = (await encode(canvas, png ? "image/png" : "image/webp", 0.92)) ?? (await encode(canvas, "image/jpeg", 0.92));
    if (!blob || blob.size >= file.size) return file;

    const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${ext}`, { type: blob.type, lastModified: file.lastModified });
  } catch {
    return file;
  } finally {
    bitmap.close();
  }
}

async function decode(file: File): Promise<ImageBitmap | null> {
  try {
    // Browsers ignore EXIF rotation by default; a phone photo would arrive sideways.
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    try {
      return await createImageBitmap(file);
    } catch {
      return null;
    }
  }
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob && blob.type === type ? blob : null), type, quality);
  });
}
