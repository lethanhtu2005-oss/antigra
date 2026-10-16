"use client";

import { useState } from "react";
import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
import { useA11y } from "@/components/A11yProvider";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import {
  SpeakerIcon, AccessibleIcon, MapPinIcon, CalendarIcon, CheckIcon,
} from "@/components/Icons";
import { getDestination } from "@/data/destinations";
import { getItem } from "@/data/catalog";
import { getArticle } from "@/data/articles";

export default function ArticleDetailClient({ article }) {
  const { speak, stop } = useA11y();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [reading, setReading] = useState(false);

  // Prepare images for gallery
  const galleryImages = [
    {
      src: article.image,
      alt: article.alt,
      title: article.title,
      credit: "Ảnh tư liệu minh họa · WayEcho Cẩm nang",
    },
  ];

  function listenFullArticle() {
    setReading(true);
    const allText = `${article.title}. ${article.summary}. ` +
      article.content.map((sec) => `${sec.heading}. ${sec.paragraphs.join(" ")}`).join(" ");
    speak(allText);
  }

  function handleStop() {
    setReading(false);
    stop();
  }

  return (
    <article className="container-page py-10" aria-labelledby="article-title">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <Link href="/cam-nang" className="hover:underline">Cẩm nang</Link> · <span aria-current="page" className="font-semibold text-ink">{article.category}</span>
      </nav>

      {/* Header */}
      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-soft hc-muted">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-ink font-bold">{article.category}</span>
          <span>Ngày cập nhật: {article.date}</span>
          <span>· {article.readTime}</span>
        </div>
        <h1 id="article-title" className="mt-4 text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          {article.title}
        </h1>
        <p className="hc-muted mt-4 text-xl leading-relaxed text-ink-soft font-normal">
          {article.summary}
        </p>

        {/* Audio narration toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface-alt p-4 hc-surface hc-border">
          <button
            type="button"
            onClick={reading ? handleStop : listenFullArticle}
            className="btn-primary !min-h-[44px] text-base"
          >
            <SpeakerIcon size={20} />
            {reading ? "Dừng nghe bài viết" : "Nghe toàn bộ bài viết bằng giọng nói"}
          </button>
          <span className="text-xs text-ink-soft hc-muted">
            Tương thích trình đọc màn hình và hỗ trợ điều chỉnh tốc độ đọc trong hồ sơ.
          </span>
        </div>
      </header>

      {/* Featured Image with Lightbox click */}
      <figure className="mt-8 overflow-hidden rounded-3xl border border-line bg-surface-alt shadow-card hc-border">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setGalleryOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setGalleryOpen(true); }}
          className="group relative aspect-[16/9] max-h-[500px] w-full cursor-zoom-in"
          aria-label="Nhấn để mở xem ảnh lớn trong thư viện"
        >
          <VerifiedImage
            src={article.image}
            fallback="/assets/images/location-image-unavailable.svg"
            alt={article.alt}
            priority
            className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl bg-black/70 px-4 py-2 text-xs text-white backdrop-blur-sm">
            <span>{article.alt}</span>
            <span className="shrink-0 font-bold ml-2">🔍 Mở ảnh lớn</span>
          </div>
        </div>
        <figcaption className="p-3 text-xs text-ink-soft hc-muted text-center">
          Nhấn vào ảnh để xem kích thước lớn, đọc chú thích chi tiết hoặc nghe mô tả ảnh bằng giọng nói.
        </figcaption>
      </figure>

      {/* Main Body + Sidebar */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-8">
          {article.content.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                {sec.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base sm:text-lg leading-relaxed text-ink-soft hc-surface">
                {sec.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          {/* Sources and Verification Note (CT08) */}
          <div className="mt-12 rounded-2xl border border-line bg-surface-alt p-6 hc-surface hc-border">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CheckIcon size={20} /> Nguồn dữ liệu & xác minh thực tế
            </h3>
            <p className="mt-2 text-sm text-ink-soft hc-muted">
              Nội dung bài viết được đối chiếu với các nguồn chính thống và dữ liệu khảo sát thực tế vào ngày <strong>{article.updatedAt}</strong>.
            </p>
            {article.sources && article.sources.length > 0 && (
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-accent-dark">
                {article.sources.map((s, idx) => (
                  <li key={idx}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar: Table of contents + Related links */}
        <aside className="space-y-6">
          {/* Table of Contents */}
          <nav aria-label="Mục lục bài viết" className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sticky top-24">
            <h2 className="text-xl font-bold">Mục lục nội dung</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {article.toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block text-ink-soft hover:text-accent-dark hover:underline hc-muted font-medium"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cross-link to destinations (CT04) */}
          {article.relatedDestinations && article.relatedDestinations.length > 0 && (
            <div className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPinIcon size={18} /> Điểm đến liên quan
              </h2>
              <div className="mt-4 space-y-3">
                {article.relatedDestinations.map((slug) => {
                  const d = getDestination(slug);
                  if (!d) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/destination?d=${slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-line p-3 hover:bg-surface-alt hc-border"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <VerifiedImage src={d.image} fallback={d.imageFallback} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-sm group-hover:text-accent-dark">{d.name}</p>
                        <p className="text-xs text-ink-soft hc-muted">{d.area}</p>
                      </div>
                      <span aria-hidden="true" className="text-ink-soft group-hover:translate-x-1 transition-transform">›</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cross-link to services (CT05) */}
          {article.relatedServices && article.relatedServices.length > 0 && (
            <div className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AccessibleIcon size={18} /> Dịch vụ hỗ trợ phù hợp
              </h2>
              <div className="mt-4 space-y-3">
                {article.relatedServices.map((id) => {
                  const item = getItem(id);
                  if (!item) return null;
                  return (
                    <div key={id} className="rounded-2xl border border-line p-3 hc-border">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-ink-soft hc-muted mt-1">{item.price}</p>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/booking?item=${item.id}`} className="btn-primary !min-h-[36px] !py-1 text-xs">
                          <CalendarIcon size={14} /> Đặt dịch vụ
                        </Link>
                        <Link href={`/item?id=${item.id}`} className="btn-ghost hc-border !min-h-[36px] !py-1 text-xs">
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* CTA Continuous Exploration (CT07) */}
      <section className="mt-16 rounded-3xl border-2 border-primary bg-gradient-to-r from-[#fff7ea] to-[#fffdfa] p-8 shadow-card hc-surface hc-border text-center">
        <h2 className="text-3xl font-bold">Tiếp tục hành trình khám phá Hà Nội</h2>
        <p className="hc-muted mt-2 max-w-2xl mx-auto text-ink-soft">
          Xem bản đồ tiếp cận có hướng dẫn giọng nói hoặc khám phá thêm những câu chuyện du lịch khác.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/explore" className="btn-primary text-base">
            Khám phá điểm đến & dịch vụ →
          </Link>
          <Link href="/navigation" className="btn-ghost hc-border text-base">
            Mở bản đồ giọng nói
          </Link>
          <Link href="/cam-nang" className="btn-ghost hc-border text-base">
            Xem cẩm nang khác
          </Link>
        </div>
      </section>

      {/* Lightbox Modal (UI04, CT06) */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        images={galleryImages}
        currentIndex={0}
        onClose={() => setGalleryOpen(false)}
        onSelectIndex={() => {}}
      />
    </article>
  );
}
