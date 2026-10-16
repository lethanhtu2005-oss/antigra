"use client";

import Link from "next/link";
import VerifiedImage from "./VerifiedImage";

export const SAMPLE_ADS = [
  {
    id: "ad-hanoi-bus",
    title: "Mẫu quảng cáo: dịch vụ di chuyển tiếp cận",
    subtitle: "Vị trí quảng cáo minh họa. Chưa có nhà tài trợ hay cam kết dịch vụ nào là thật.",
    tag: "Giao thông tiếp cận",
    sponsor: "Nhà tài trợ minh họa (không có thật)",
    link: "/services",
    cta: "Tìm hiểu dịch vụ",
    image: "/assets/images/street-bikes.jpg",
  },
  {
    id: "ad-guide-dog",
    title: "Mẫu quảng cáo: lưu trú đón khách đi cùng chó dẫn đường",
    subtitle: "Vị trí quảng cáo minh họa. Chưa có khách sạn nào được xác minh hoặc cam kết chính sách.",
    tag: "Lưu trú tiếp cận",
    sponsor: "Nhà tài trợ minh họa (không có thật)",
    link: "/guide-dog",
    cta: "Xem cẩm nang",
    image: "/assets/images/cafe-street.jpg",
  },
];

export default function AdBanner({ ad = SAMPLE_ADS[0], variant = "card" }) {
  if (!ad) return null;

  if (variant === "compact") {
    return (
      <aside aria-label="Nội dung tài trợ" className="rounded-2xl border border-line bg-surface-alt p-3.5 hc-surface hc-border">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-soft hc-muted">
          <span>{ad.sponsor}</span>
          <span className="rounded bg-line px-1.5 py-0.5 text-[10px]">QC mẫu</span>
        </div>
        <h4 className="mt-1 text-base font-bold">{ad.title}</h4>
        <p className="mt-0.5 text-xs text-ink-soft hc-muted">{ad.subtitle}</p>
        <Link href={ad.link} className="mt-2 inline-flex text-xs font-semibold text-accent-dark hover:underline">
          {ad.cta} →
        </Link>
      </aside>
    );
  }

  return (
    <aside aria-label="Nội dung quảng cáo đối tác" className="overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-[#fff7ea] to-[#fffcf7] p-5 shadow-card hc-surface hc-border sm:p-7">
      <div className="flex items-center justify-between">
        <span className="chip hc-surface hc-border text-xs uppercase tracking-wider text-ink-soft font-bold">
          {ad.tag}
        </span>
        <span className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-bold text-ink-soft hc-surface hc-border">
          QUẢNG CÁO MẪU (DEMO)
        </span>
      </div>

      <div className="mt-4 grid items-center gap-5 sm:grid-cols-[1fr_160px]">
        <div>
          <h3 className="text-2xl font-bold">{ad.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft hc-muted">{ad.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href={ad.link} className="btn-primary !min-h-[40px] !py-2 text-sm">
              {ad.cta} →
            </Link>
            <span className="text-xs text-ink-soft hc-muted">Bởi {ad.sponsor}</span>
          </div>
        </div>

        {ad.image && (
          <div className="hidden sm:block aspect-[4/3] overflow-hidden rounded-2xl">
            <VerifiedImage src={ad.image} fallback="/assets/images/location-image-unavailable.svg" alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </aside>
  );
}
