"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { destinations } from "@/data/destinations";
import { catalog } from "@/data/catalog";
import { MicIcon, SearchIcon, SpeakerIcon, AccessibleIcon, MapPinIcon, CalendarIcon } from "@/components/Icons";

const QUICK_QUERIES = [
  "Hồ Gươm",
  "Văn Miếu",
  "Phố cổ",
  "Chó dẫn đường",
  "Khách sạn tiếp cận",
  "Vé múa rối nước",
  "Xe điện du lịch",
];

function normalize(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { speak } = useA11y();
  const [query, setQuery] = useState(initialQ);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [simListening, setSimListening] = useState(false);
  const [results, setResults] = useState([]);

  // Merge destinations and catalog services with a common shape
  const allSearchItems = useMemo(() => [
    ...destinations.map((d) => ({
      type: "destination",
      id: d.slug,
      name: d.name,
      area: d.area,
      summary: d.summary,
      level: d.access.level,
      status: d.access.status,
      image: d.image,
      imageFallback: d.imageFallback,
      alt: d.alt,
      audio: d.audio,
      link: `/destination?d=${d.slug}`,
      tags: d.tags || [],
    })),
    ...catalog.filter((c) => c.cat !== "destination").map((s) => ({
      type: s.cat,
      id: s.id,
      name: s.name,
      area: s.area,
      summary: s.summary,
      level: s.level,
      status: s.note,
      image: s.image,
      imageFallback: s.imageFallback || "/assets/images/location-image-unavailable.svg",
      alt: s.alt,
      audio: s.audio,
      price: s.price,
      link: `/item?id=${s.id}`,
      tags: [s.cat, s.isDemo ? "demo" : "verified"],
    })),
  ], []);

  const runSearch = useCallback((text, cat = categoryFilter) => {
    const clean = (text || "").trim();
    setQuery(clean);
    const normQ = normalize(clean);

    let filtered = allSearchItems;
    if (cat !== "all") {
      filtered = filtered.filter((item) => item.type === cat || (cat === "service" && item.type !== "destination"));
    }

    if (normQ) {
      filtered = filtered.filter((item) => {
        const fullString = [
          item.name,
          item.area,
          item.summary,
          item.level,
          item.status,
          ...(item.tags || []),
        ].join(" ");
        return normalize(fullString).includes(normQ);
      });
    }

    setResults(filtered);
    if (clean) {
      speak(filtered.length ? `Tìm thấy ${filtered.length} kết quả cho ${clean}.` : `Không tìm thấy kết quả phù hợp với từ khóa ${clean}.`);
    }
  }, [allSearchItems, categoryFilter, speak]);

  useEffect(() => {
    runSearch(initialQ, categoryFilter);
  }, [initialQ, categoryFilter, runSearch]);

  const { supported, listening: realListening, start } = useSpeechRecognition({
    onResult: (t) => runSearch(t),
  });
  const listening = realListening || simListening;

  function handleMic() {
    if (listening) return;
    speak("Đang lắng nghe giọng nói của bạn.");
    if (supported) {
      start();
      return;
    }
    setSimListening(true);
    setTimeout(() => {
      setSimListening(false);
      runSearch("Văn Miếu");
    }, 1200);
  }

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <span aria-current="page" className="font-semibold text-ink">Tìm kiếm</span>
      </nav>

      <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Tìm kiếm điểm đến & dịch vụ</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">
        Nói hoặc gõ từ khóa tiếng Việt (có dấu hoặc không dấu). Tìm kiếm địa danh, lưu trú, vé tham quan, xe cộ và dịch vụ tiếp cận tại Hà Nội.
      </p>

      {/* Search Input Bar */}
      <form
        role="search"
        className="mt-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <label htmlFor="q" className="sr-only">Nhập nội dung tìm kiếm</label>
        <div className="flex flex-1 items-center gap-3 rounded-full border border-line bg-white px-5 shadow-sm hc-surface hc-border">
          <SearchIcon size={22} className="text-ink-soft shrink-0" />
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: hồ gươm, chó dẫn đường, khách sạn, vé..."
            className="w-full bg-transparent py-4 text-lg outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); runSearch(""); }}
              className="text-ink-soft hover:text-ink text-sm font-bold"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary text-lg !px-8">
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={handleMic}
          aria-pressed={listening}
          aria-label={listening ? "Đang lắng nghe..." : "Tìm kiếm bằng giọng nói"}
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-card ${
            listening ? "listening-ring" : "hover:bg-neutral-800"
          }`}
        >
          <MicIcon size={26} />
        </button>
      </form>

      {/* Category Filter Tabs */}
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo loại hình">
        {[
          { id: "all", label: "Tất cả" },
          { id: "destination", label: "Điểm đến" },
          { id: "accommodation", label: "Lưu trú" },
          { id: "ticket", label: "Vé tham quan" },
          { id: "transport", label: "Di chuyển" },
          { id: "activity", label: "Tour & Hoạt động" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={categoryFilter === tab.id}
            onClick={() => {
              setCategoryFilter(tab.id);
              runSearch(query, tab.id);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              categoryFilter === tab.id
                ? "bg-primary text-ink shadow-sm"
                : "border border-line bg-white text-ink hover:bg-surface-alt hc-surface hc-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Suggested Quick Queries */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-ink-soft hc-muted">Gợi ý tìm kiếm:</span>
        {QUICK_QUERIES.map((qs) => (
          <button
            key={qs}
            type="button"
            onClick={() => runSearch(qs)}
            className="chip hc-surface hc-border hover:bg-primary transition"
          >
            “{qs}”
          </button>
        ))}
      </div>

      {/* Results List */}
      <h2 className="mt-10 text-2xl font-bold" aria-live="polite">
        {results.length} kết quả{query ? ` cho “${query}”` : ""}
      </h2>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg font-semibold">Không tìm thấy kết quả nào phù hợp.</p>
          <p className="text-sm text-ink-soft hc-muted mt-2">
            Thử tìm kiếm với từ khóa khác như &ldquo;Hồ Gươm&rdquo;, &ldquo;Văn Miếu&rdquo;, &ldquo;Khách sạn&rdquo;, hoặc &ldquo;Chó dẫn đường&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => { setQuery(""); setCategoryFilter("all"); runSearch("", "all"); }}
            className="btn-ghost hc-border mt-4 text-sm"
          >
            Xóa bộ lọc & xem tất cả
          </button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {results.map((item) => (
            <li
              key={item.id}
              className="card hc-surface hc-border flex flex-col gap-4 border border-line p-4 sm:flex-row sm:items-center hover:shadow-card-hover transition"
            >
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-surface-alt sm:w-48">
                <VerifiedImage
                  src={item.image}
                  fallback={item.imageFallback}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft hc-muted">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPinIcon size={14} /> {item.area}
                  </span>
                  {item.level && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-2.5 py-0.5 font-bold text-ink hc-surface hc-border">
                      <AccessibleIcon size={13} /> {item.level}
                    </span>
                  )}
                  {item.price && (
                    <span className="font-bold text-accent-dark">{item.price}</span>
                  )}
                </div>

                <h3 className="mt-1.5 text-xl font-bold">
                  <Link href={item.link} className="hover:text-accent-dark hover:underline">
                    {item.name}
                  </Link>
                </h3>
                <p className="hc-muted mt-1 text-sm text-ink-soft line-clamp-2">
                  {item.summary}
                </p>
                {item.status && (
                  <p className="mt-2 text-xs font-semibold text-ink-soft hc-muted">
                    Tiếp cận: {item.status}
                  </p>
                )}
              </div>

              <div className="flex gap-2 sm:flex-col shrink-0">
                <Link
                  href={item.link}
                  className="btn-primary !min-h-[40px] !py-2 text-sm flex-1 text-center"
                >
                  Xem chi tiết
                </Link>
                {item.audio && (
                  <button
                    type="button"
                    onClick={() => speak(item.audio)}
                    className="btn-ghost hc-border !min-h-[40px] !py-2 text-sm"
                    aria-label={`Nghe mô tả ${item.name}`}
                  >
                    <SpeakerIcon size={16} /> Nghe
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải tìm kiếm…</div>}>
      <SearchContent />
    </Suspense>
  );
}
