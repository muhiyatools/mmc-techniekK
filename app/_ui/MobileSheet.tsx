"use client";

import { useEffect, useRef } from "react";

const IconX = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function MobileSheet({ open, onClose, title, children }: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Trap scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        className={`mobile-sheet-overlay md:hidden${open ? " open" : ""}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className={`mobile-sheet md:hidden${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Drag handle */}
        <div className="mobile-sheet-handle" />

        {/* Header row */}
        {title && (
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="text-label text-muted">{title}</span>
              <button
              onClick={onClose}
              className="touch-target text-muted hover:text-ink transition-colors"
              aria-label="Sluiten"
            >
              <IconX />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-5 pb-6 pt-2">
          {children}
        </div>
      </div>
    </>
  );
}
