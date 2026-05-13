"use client";

import { useState } from "react";

interface BrandLogoProps {
  brand: string;
  imageSrc: string;
  height?: number;
  className?: string;
}

export default function BrandLogo({ brand, imageSrc, height = 28, className }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!imageSrc || failed) {
    return (
      <span className={`text-xs font-bold uppercase tracking-wider text-brand ${className ?? ""}`}>
        {brand}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className ?? ""}`}
      style={{ height: `${height}px`, maxWidth: `${Math.max(height * 4, 120)}px` }}
    >
      <img
        src={imageSrc}
        alt={brand}
        className="max-h-full max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
