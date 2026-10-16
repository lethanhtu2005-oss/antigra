"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { destinations } from "@/data/destinations";
import { CompassIcon, SpeakerIcon, MapPinIcon, CheckIcon } from "@/components/Icons";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[360px] items-center justify-center bg-surface-alt text-ink-soft">
      Đang tải bản đồ tiếp cận…
    </div>
  ),
});

const DEST_POINTS = destinations
  .filter((d) => d.coordinates)
  .map((d) => ({
    id: d.slug,
    name: d.name,
    lat: d.coordinates.lat,
    lng: d.coordinates.lng,
    level: d.access.level,
    href: `/destination?d=${d.slug}`,
  }));

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function calcBearing(lat1, lon1, lat2, lon2) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const compass = ["Bắc", "Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc"];
  return compass[Math.round(deg / 45) % 8];
}

export default function NavigationPage() {
  const { speak } = useA11y();

  // Selected destination slug
  const [selectedSlug, setSelectedSlug] = useState(destinations[0]?.slug || "ho-guom");
  const dest = destinations.find((d) => d.slug === selectedSlug) || destinations[0];

  // User position (default center of Hanoi pedestrian area near Ho Guom)
  const [userPos, setUserPos] = useState({ lat: 21.031578, lng: 105.853047, isRealGps: false });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const [activeStep, setActiveStep] = useState(0);

  // Compute distance and bearing
  const distanceM = dest.coordinates
    ? calcDistance(userPos.lat, userPos.lng, dest.coordinates.lat, dest.coordinates.lng)
    : 0;
  const distanceFormatted =
    distanceM > 1000 ? `${(distanceM / 1000).toFixed(1)} km` : `${distanceM} mét`;
  const bearingDir = dest.coordinates
    ? calcBearing(userPos.lat, userPos.lng, dest.coordinates.lat, dest.coordinates.lng)
    : "phía trước";

  // Dynamic route polyline: user -> midpoint -> destination
  const route = dest.coordinates
    ? [
        [userPos.lat, userPos.lng],
        [(userPos.lat + dest.coordinates.lat) / 2, (userPos.lng + dest.coordinates.lng) / 2],
        [dest.coordinates.lat, dest.coordinates.lng],
      ]
    : [];

  // Dynamic contextual steps
  const steps = [
    {
      title: "Xác định phương hướng & cự ly",
      text: `Từ vị trí của bạn, ${dest.name} cách khoảng ${distanceFormatted} theo hướng ${bearingDir}. ${userPos.isRealGps ? "(Đã định vị bằng GPS thời gian thực)" : "(Đang dùng tọa độ mẫu khu vực trung tâm Hoàn Kiếm)"}`,
      meta: "Cự ly ước tính theo đường chim bay",
      hazard: false,
    },
    {
      title: "Lưu ý vỉa hè & chướng ngại vật sát mặt đất",
      text: "Vỉa hè tại các tuyến phố Hà Nội có thể có xe máy dừng đỗ hoặc gốc cây. Khuyến nghị sử dụng gậy trắng quét mép trong của lối đi hoặc để chó dẫn đường điều hướng tránh vật cản.",
      meta: "Khảo sát thực địa vỉa hè",
      hazard: true,
    },
    {
      title: "Giao cắt & cảnh báo qua đường",
      text: "Khi tới các ngã ba hoặc ngã tư có đèn tín hiệu, hãy dừng lại, lắng nghe tiếng chuông tín hiệu âm thanh dành cho người đi bộ (nếu có) hoặc nhờ người xung quanh hỗ trợ qua đường.",
      meta: "Ưu tiên an toàn tuyệt đối",
      hazard: true,
    },
    {
      title: `Tiếp cận lối vào ${dest.name}`,
      text: `Địa chỉ: ${dest.address}. Trạng thái tiếp cận: ${dest.access.level}. Lưu ý: ${dest.access.note || "Kiểm tra với quầy hỗ trợ tại điểm đến."}`,
      meta: "Điểm đến đích",
      hazard: false,
    },
  ];

  function fetchGps() {
    if (!navigator.geolocation) {
      setGpsError("Trình duyệt không hỗ trợ Geolocation.");
      speak("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    speak("Đang xác định tọa độ GPS của bạn...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude, isRealGps: true });
        setGpsLoading(false);
        const msg = `Đã cập nhật vị trí GPS. Độ chính xác khoảng ${Math.round(accuracy)} mét.`;
        speak(msg);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError("Không thể lấy vị trí GPS. Hãy kiểm tra quyền truy cập vị trí.");
        speak("Không lấy được tọa độ GPS. Đang sử dụng vị trí mẫu tại trung tâm Hà Nội.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function playStep(i) {
    setActiveStep(i);
    speak(`Bước ${i + 1}: ${steps[i].title}. ${steps[i].text}`);
  }

  function playAll() {
    const fullSpeech = `Hướng dẫn đi tới ${dest.name}. Bạn cách điểm đến ${distanceFormatted} theo hướng ${bearingDir}. ` +
      steps.map((s, idx) => `Bước ${idx + 1}: ${s.text}`).join(" ");
    speak(fullSpeech);
  }

  const mapCenter = dest.coordinates
    ? [(userPos.lat + dest.coordinates.lat) / 2, (userPos.lng + dest.coordinates.lng) / 2]
    : [21.032, 105.846];

  const gmapsUrl = dest.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}&travelmode=walking`
    : "#";

  return (
    <div className="container-page py-10">
      <p className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · Điều hướng tiếp cận
      </p>

      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="chip hc-surface hc-border text-xs font-bold text-accent-dark">
            Accessible Navigation · Giọng nói
          </span>
          <h1 className="mt-1 text-4xl sm:text-5xl font-bold">Bản đồ & Chỉ đường âm thanh</h1>
          <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">
            Hỗ trợ định hướng bằng giọng nói và cảnh báo tiếp cận dựa trên dữ liệu đối chiếu thực tế.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchGps}
          disabled={gpsLoading}
          className="btn-ghost hc-border !min-h-[44px] !px-4 !py-2 text-sm font-semibold flex items-center gap-2"
        >
          <MapPinIcon size={18} />
          {gpsLoading ? "Đang dò GPS..." : userPos.isRealGps ? "Cập nhật lại GPS" : "Lấy vị trí GPS của tôi"}
        </button>
      </div>

      {gpsError && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {gpsError}
        </div>
      )}

      {/* Destination Landmark Selector */}
      <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-card hc-surface hc-border">
        <label htmlFor="landmark-select" className="block text-sm font-bold text-ink-soft hc-muted mb-2">
          Chọn điểm đến tại Hà Nội:
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {destinations.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(d.slug);
                setActiveStep(0);
                speak(`Đã chọn điểm đến: ${d.name}.`);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedSlug === d.slug
                  ? "bg-primary text-ink shadow-sm"
                  : "bg-surface-alt text-ink hover:bg-white border border-line hc-surface hc-border"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map & Voice Steps */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Left: Interactive Map */}
        <div>
          <div
            className="h-[380px] overflow-hidden rounded-[22px] border border-line shadow-card hc-border"
            role="region"
            aria-label={`Bản đồ tiếp cận đi tới ${dest.name}`}
          >
            <MapView
              key={`${mapCenter[0]}-${mapCenter[1]}-${selectedSlug}`}
              points={DEST_POINTS}
              route={route}
              center={mapCenter}
              zoom={14}
            />
          </div>
          <p className="hc-muted mt-2 text-xs text-ink-soft">
            Nền bản đồ OpenStreetMap. Đường nét đứt màu cam minh họa hướng kết nối từ vị trí hiện tại đến {dest.name}.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={playAll}
              className="btn-primary text-base flex items-center gap-2"
            >
              <SpeakerIcon size={20} /> Đọc toàn bộ lộ trình
            </button>
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost hc-border text-base flex items-center gap-2"
            >
              <CompassIcon size={20} /> Mở bản đồ Google Maps ↗
            </a>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 text-sm" role="alert">
            <strong className="block mb-1 font-bold">Lưu ý an toàn quan trọng:</strong>
            Độ chính xác GPS trong đô thị có sai số từ 5–15 mét do các công trình cao tầng che chắn sóng vệ tinh. Hệ thống không thể phát hiện các chướng ngại vật tức thời hoặc xe đang di chuyển. Luôn kết hợp sử dụng gậy trắng, chó dẫn đường hoặc nhờ người trợ giúp khi sang đường.
          </div>
        </div>

        {/* Right: Step-by-step Audio Guidance */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Lộ trình tiếp cận từng bước</h2>
            <span className="text-sm font-semibold text-primary">
              Khoảng {distanceFormatted} · Hướng {bearingDir}
            </span>
          </div>

          <ol className="space-y-3" aria-label="Các bước chỉ đường bằng âm thanh">
            {steps.map((s, idx) => (
              <li
                key={s.title}
                className={`rounded-2xl border p-4 transition hc-surface hc-border ${
                  activeStep === idx
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-line bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                      s.hazard ? "bg-orange-600 text-white" : "bg-primary text-ink"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft hc-muted">{s.text}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-ink-soft hc-muted">
                      <MapPinIcon size={14} /> {s.meta}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playStep(idx)}
                    className="btn-ghost hc-border !min-h-[40px] !p-2 shrink-0 hover:bg-primary"
                    aria-label={`Nghe nội dung bước ${idx + 1}`}
                  >
                    <SpeakerIcon size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-2xl border border-line bg-surface-alt p-4 hc-surface hc-border flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">Khám phá chi tiết điểm đến</p>
              <p className="text-xs text-ink-soft hc-muted">Xem đầy đủ thông tin vé, giờ mở cửa và tiện ích tiếp cận.</p>
            </div>
            <Link
              href={`/destination?d=${dest.slug}`}
              className="btn-primary !min-h-[38px] !px-4 !py-1.5 text-xs font-bold"
            >
              Chi tiết {dest.name} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
