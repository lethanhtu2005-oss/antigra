"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import DestinationCard from "@/components/DestinationCard";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import { getDestination, destinations } from "@/data/destinations";
import { api } from "@/lib/api";
import {
  SpeakerIcon, MapPinIcon, AccessibleIcon, CompassIcon, CalendarIcon, PhoneIcon, HeartIcon, PlusIcon,
} from "@/components/Icons";

function AccessRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 hc-border sm:grid-cols-[220px_1fr] sm:gap-5">
      <dt className="font-semibold">{label}</dt>
      <dd className="hc-muted text-ink-soft">{value}</dd>
    </div>
  );
}

function DestinationContent() {
  const params = useSearchParams();
  const slug = params.get("d");
  const d = getDestination(slug);
  const { speak } = useA11y();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (d?.slug) {
      api.listSaved().then((list) => {
        if (list?.some((item) => item.refId === d.slug)) setSaved(true);
      }).catch(() => {});
    }
  }, [d?.slug]);

  if (!slug) {
    return (
      <div className="container-page py-10">
        <p className="font-semibold text-accent-dark">Destination & Accessibility Data</p>
        <h1 className="mt-1 text-4xl sm:text-5xl">Điểm đến Hà Nội</h1>
        <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">Ảnh địa điểm đã được đối chiếu theo nguồn. Accessibility data chưa đủ bằng chứng được gắn nhãn “cần khảo sát / cần xác minh” thay vì suy đoán.</p>
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{destinations.map((item) => <DestinationCard key={item.slug} d={item} />)}</div>
      </div>
    );
  }

  // Không tự rơi về địa điểm khác: người khiếm thị có thể nghe nhầm mô tả nơi mình không định tới.
  if (!d) {
    return (
      <div className="container-page py-16" role="alert">
        <h1 className="text-3xl">Không tìm thấy điểm đến</h1>
        <p className="hc-muted mt-3 text-lg text-ink-soft">Đường dẫn không khớp với địa điểm nào trong dữ liệu WayEcho.</p>
        <Link href="/destination" className="btn-primary mt-5">Xem danh sách điểm đến</Link>
      </div>
    );
  }

  const accessRows = [
    ["Phù hợp người mù", d.access.blind],
    ["Phù hợp người nhìn kém", d.access.lowVision],
    ["Nhân viên / quầy hỗ trợ", d.access.staff],
    ["Audio / thuyết minh", d.access.audio],
    ["Braille", d.access.braille],
    ["Thang máy", d.access.elevator],
    ["Lối không bậc", d.access.stepFree],
  ];

  const galleryImages = [
    {
      src: d.image,
      fallback: d.imageFallback,
      alt: d.alt,
      title: d.name,
      credit: d.imageCredit,
      link: `/destination?d=${d.slug}`,
    },
  ];

  async function toggleSave() {
    try {
      if (saved) {
        await api.unsavePlace(d.slug);
        setSaved(false);
        speak(`Đã bỏ lưu ${d.name}.`);
      } else {
        await api.savePlace({ refId: d.slug, name: d.name, cat: "destination", image: d.image, area: d.area });
        setSaved(true);
        speak(`Đã lưu ${d.name} vào danh sách yêu thích.`);
      }
    } catch (_) {}
  }

  async function handleAddToTrip() {
    try {
      await api.addToTrip({ refId: d.slug, name: d.name, cat: "destination", image: d.image, area: d.area });
      setAdded(true);
      speak(`Đã thêm ${d.name} vào hành trình chuyến đi.`);
    } catch (_) {}
  }

  return (
    <div className="container-page py-10">
      <p className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <Link href="/destination" className="hover:underline">Điểm đến</Link> ·{" "}
        <MapPinIcon size={14} className="inline align-[-2px]" /> {d.area}
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <figure>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setGalleryOpen(true)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setGalleryOpen(true); }}
            className="group relative aspect-[4/3] overflow-hidden rounded-[18px] bg-surface-alt shadow-card cursor-zoom-in"
            aria-label="Nhấn để mở xem ảnh lớn trong thư viện"
          >
            <VerifiedImage src={d.image} fallback={d.imageFallback} alt={d.alt} priority className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102" />
            <span className="absolute bottom-3 right-3 rounded-xl bg-black/75 px-3 py-1.5 text-xs font-semibold text-white">
              🔍 Mở ảnh lớn
            </span>
          </div>
          <figcaption className="hc-muted mt-2 text-sm text-ink-soft">
            <span className="font-semibold text-ink">Ảnh:</span> {d.imageCredit}. {d.imageSource && (
              <a href={d.imageSource} target="_blank" rel="noreferrer" className="font-semibold text-accent-dark underline">Xem nguồn ảnh</a>
            )}
          </figcaption>
        </figure>

        <div>
          <span className="chip hc-surface hc-border bg-primary font-bold">
            <AccessibleIcon size={16} /> Accessibility: {d.access.level}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl">{d.name}</h1>
          <p className="mt-2 flex items-start gap-2 text-ink-soft hc-muted"><MapPinIcon size={18} className="mt-1 shrink-0" /> {d.address}</p>
          <p className="hc-muted mt-3 text-lg text-ink-soft">{d.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => speak(d.audio)} className="btn-primary text-base">
              <SpeakerIcon size={20} /> Nghe mô tả
            </button>
            <button type="button" onClick={toggleSave} className="btn-ghost hc-border text-base">
              <HeartIcon size={20} filled={saved} className={saved ? "text-red-600" : ""} /> {saved ? "Đã lưu" : "Lưu địa điểm"}
            </button>
            <button type="button" onClick={handleAddToTrip} className="btn-ghost hc-border text-base">
              <PlusIcon size={20} /> {added ? "Đã thêm chuyến" : "Thêm chuyến đi"}
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-surface-alt p-4 hc-surface hc-border">
            <p className="text-sm font-semibold text-ink-soft hc-muted">Mô tả âm thanh có cảnh báo mức độ chắc chắn</p>
            <p className="mt-1 text-lg">{d.audio}</p>
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]" aria-labelledby="access-heading">
        <div>
          <h2 id="access-heading" className="text-3xl">Dữ liệu tiếp cận</h2>
          <p className="hc-muted mt-2 max-w-3xl text-ink-soft">
            WayEcho tách thông tin địa điểm khỏi dữ liệu accessibility. “Chưa công bố” không có nghĩa là “không có”; nó có nghĩa là bản demo chưa có nguồn đủ tin cậy để xác nhận.
          </p>
          <dl className="mt-4">
            <AccessRow label="Trạng thái dữ liệu" value={d.access.status} />
            {accessRows.map(([label, value]) => <AccessRow key={label} label={label} value={value} />)}
            <AccessRow label="Ghi chú an toàn" value={d.access.note} />
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/review?item=${d.slug}`} className="btn-ghost hc-border text-sm">
              ★ Đánh giá trải nghiệm tiếp cận
            </Link>
            <Link href={`/review?item=${d.slug}&action=report`} className="btn-ghost hc-border text-sm text-amber-800 hover:bg-amber-50">
              ⚠ Báo cáo thông tin tiếp cận sai
            </Link>
          </div>
        </div>

        <aside className="rounded-[18px] border border-line bg-white p-5 shadow-card hc-surface hc-border" aria-labelledby="visit-heading">
          <h2 id="visit-heading" className="text-2xl">Thông tin đã đối chiếu</h2>
          <dl className="mt-3 space-y-3">
            <div><dt className="font-semibold">Giờ tham quan</dt><dd className="hc-muted text-ink-soft">{d.visit.hours}</dd></div>
            <div><dt className="font-semibold">Giá / vé</dt><dd className="hc-muted text-ink-soft">{d.visit.price}</dd></div>
            <div><dt className="font-semibold">Kiểm tra dữ liệu</dt><dd className="hc-muted text-ink-soft">{d.checkedAt}</dd></div>
          </dl>
          {d.facts.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-soft hc-muted">
              {d.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          {d.sources.length > 0 && (
            <div className="mt-5 border-t border-line pt-4 hc-border">
              <p className="font-semibold">Nguồn công khai</p>
              <ul className="mt-2 space-y-2 text-sm">
                {d.sources.map((s) => (
                  <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-accent-dark underline">{s.label}</a></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/booking?item=${d.slug}`} className="btn-primary text-lg"><CalendarIcon size={22} /> Tạo yêu cầu / đặt dịch vụ</Link>
        <Link href={`/navigation?to=${d.slug}`} className="btn-ghost hc-border text-lg"><CompassIcon size={22} /> Mở bản đồ giọng nói</Link>
        <Link href="/help" className="btn-ghost hc-border text-lg"><PhoneIcon size={22} /> Hỗ trợ con người</Link>
      </div>

      {/* Cẩm nang liên quan */}
      <section className="mt-14" aria-labelledby="handbook-related-heading">
        <h2 id="handbook-related-heading" className="text-2xl font-bold">Cẩm nang khám phá hữu ích</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link href="/cam-nang/du-lich-ha-noi-cho-nguoi-khiem-thi" className="card hc-surface hc-border p-4 border border-line hover:bg-surface-alt">
            <span className="text-xs font-bold text-accent-dark">Cẩm nang</span>
            <p className="font-semibold mt-1">Kinh nghiệm du lịch Hà Nội cho người khiếm thị</p>
            <p className="text-xs text-ink-soft hc-muted mt-1">Lịch trình và lưu ý vỉa hè an toàn</p>
          </Link>
          <Link href="/cam-nang/cho-dan-duong-ha-noi" className="card hc-surface hc-border p-4 border border-line hover:bg-surface-alt">
            <span className="text-xs font-bold text-accent-dark">Chó dẫn đường</span>
            <p className="font-semibold mt-1">Đồng hành cùng chó dẫn đường tại Hà Nội</p>
            <p className="text-xs text-ink-soft hc-muted mt-1">Quy định và địa điểm tiếp nhận thân thiện</p>
          </Link>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-2xl">Điểm đến khác</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.filter((x) => x.slug !== d.slug).slice(0, 3).map((x) => (
            <li key={x.slug}>
              <Link href={`/destination?d=${x.slug}`} className="card hc-surface hc-border block h-full overflow-hidden border border-line hover:shadow-card-hover">
                <VerifiedImage src={x.image} fallback={x.imageFallback} alt={x.alt} className="h-36 w-full object-cover" />
                <span className="block p-4 text-lg font-semibold">{x.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Lightbox Modal (UI04, CT06) */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        images={galleryImages}
        currentIndex={0}
        onClose={() => setGalleryOpen(false)}
        onSelectIndex={() => {}}
      />
    </div>
  );
}

export default function DestinationView() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <DestinationContent />
    </Suspense>
  );
}
