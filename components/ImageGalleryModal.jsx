"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import VerifiedImage from "./VerifiedImage";
import { SpeakerIcon, MapPinIcon } from "./Icons";
import { useA11y } from "./A11yProvider";

export default function ImageGalleryModal({ isOpen, images = [], currentIndex = 0, onClose, onSelectIndex }) {
  const { speak } = useA11y();
  const current = images[currentIndex];

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onSelectIndex((currentIndex - 1 + images.length) % images.length);
    if (e.key === "ArrowRight") onSelectIndex((currentIndex + 1) % images.length);
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !current) return null;

  function readImageDesc() {
    speak(`${current.title || "Hình ảnh"}. Mô tả: ${current.alt || "Không có mô tả chi tiết"}. ${current.credit ? `Nguồn ảnh: ${current.credit}.` : ""}`);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thư viện ảnh phóng to"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-sm"
    >
      <div className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-2xl hc-surface hc-border">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 hc-border">
          <div className="min-w-0 pr-3">
            <h2 className="truncate text-xl font-bold">{current.title || "Bộ sưu tập ảnh"}</h2>
            <p className="text-xs text-ink-soft hc-muted">Ảnh {currentIndex + 1} trên {images.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={readImageDesc}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt hover:bg-primary"
              aria-label="Nghe mô tả ảnh bằng giọng nói"
            >
              <SpeakerIcon size={20} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt text-xl font-bold hover:bg-red-100 hover:text-red-700"
              aria-label="Đóng thư viện ảnh"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Large Image View */}
        <div className="relative flex min-h-[280px] max-h-[60vh] flex-1 items-center justify-center bg-black">
          <VerifiedImage
            src={current.src}
            fallback="/assets/images/location-image-unavailable.svg"
            alt={current.alt || "Ảnh phong cảnh Hà Nội"}
            className="max-h-[58vh] w-auto max-w-full object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onSelectIndex((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-2xl font-bold text-white transition hover:bg-black/90"
                aria-label="Ảnh trước đó"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => onSelectIndex((currentIndex + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-2xl font-bold text-white transition hover:bg-black/90"
                aria-label="Ảnh kế tiếp"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Caption & Actions */}
        <div className="border-t border-line p-5 hc-border">
          <p className="text-sm leading-relaxed text-ink hc-surface">{current.alt}</p>
          {current.credit && (
            <p className="mt-1 text-xs text-ink-soft hc-muted">
              Nguồn ảnh: {current.credit}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {current.link ? (
              <Link
                href={current.link}
                onClick={onClose}
                className="btn-primary !min-h-[42px] !py-2 text-sm"
              >
                <MapPinIcon size={16} /> Khám phá chi tiết địa điểm này →
              </Link>
            ) : (
              <Link
                href="/explore"
                onClick={onClose}
                className="btn-ghost hc-border !min-h-[42px] !py-2 text-sm"
              >
                Xem thêm điểm đến khác
              </Link>
            )}

            <div className="flex gap-1 overflow-x-auto py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectIndex(i)}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === currentIndex ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Xem ảnh số ${i + 1}`}
                >
                  <img src={img.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
