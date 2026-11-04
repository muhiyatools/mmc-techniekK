import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

const cache = new Map<string, { w: number; h: number } | null>();

/** Natural size of a PNG in /public, read from its header (no image library needed). */
export function logoSize(publicPath: string): { w: number; h: number } | null {
  if (cache.has(publicPath)) return cache.get(publicPath)!;
  let size: { w: number; h: number } | null = null;
  try {
    const file = readFileSync(path.join(process.cwd(), "public", publicPath));
    if (file.toString("ascii", 1, 4) === "PNG") size = { w: file.readUInt32BE(16), h: file.readUInt32BE(20) };
  } catch {
    size = null;
  }
  cache.set(publicPath, size);
  return size;
}

/**
 * Optical size for a logo: the same visual weight for wide wordmarks and square marks.
 * Equal area, capped on width and height, so a wide logo is never wider than the cell.
 */
export function opticalSize(size: { w: number; h: number } | null, area = 5400, maxW = 136, maxH = 50) {
  const ratio = size ? size.w / size.h : 3;
  let h = Math.sqrt(area / ratio);
  let w = ratio * h;
  if (w > maxW) {
    w = maxW;
    h = w / ratio;
  }
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  return { w: Math.round(w), h: Math.round(h) };
}
