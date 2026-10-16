"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { PhoneIcon, MapPinIcon, CheckIcon, TrashIcon, SpeakerIcon } from "@/components/Icons";

const EMERGENCY_SERVICES = [
  { name: "Cấp cứu y tế", number: "115", desc: "Hỗ trợ y tế và xe cứu thương khẩn cấp" },
  { name: "Cảnh sát phản ứng nhanh", number: "113", desc: "Can thiệp an ninh, trật tự và tai nạn giao thông" },
  { name: "Cứu nạn cứu hộ", number: "114", desc: "Cứu hộ tai nạn, cháy nổ, mắc kẹt" },
];

const MAJOR_HOSPITALS = [
  { name: "Bệnh viện Hữu nghị Việt Đức", phone: "02438253531", address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội (Trung tâm Cấp cứu Ngoại khoa)" },
  { name: "Bệnh viện Đa khoa Xanh Pôn", phone: "02438233076", address: "12 Chu Văn An, Ba Đình, Hà Nội" },
  { name: "Bệnh viện Bạch Mai", phone: "02438693731", address: "78 Giải Phóng, Đống Đa, Hà Nội (Khoa Cấp cứu A9)" },
];

export default function SOSPage() {
  const { speak } = useA11y();
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [locationStatus, setLocationStatus] = useState("Chưa yêu cầu quyền vị trí");
  const [coords, setCoords] = useState(null);
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const emg = localStorage.getItem("we-emergency") || "";
      const sep = emg.lastIndexOf(" - ");
      if (sep >= 0) {
        setContactName(emg.slice(0, sep).trim());
        setContactPhone(emg.slice(sep + 3).trim());
      } else {
        setContactPhone(emg.trim());
      }

      const h = JSON.parse(localStorage.getItem("we-sos-history") || "[]");
      setHistory(h);
    } catch (_) {}
  }, []);

  // Hủy đếm ngược khi rời trang để SOS không tự kích hoạt ngầm.
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const addIncident = useCallback((detail) => {
    const record = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      date: new Date().toLocaleDateString("vi-VN"),
      detail,
    };
    setHistory((prev) => {
      const updated = [record, ...prev.slice(0, 9)];
      try { localStorage.setItem("we-sos-history", JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  }, []);

  function triggerImmediateSOS() {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(null);
    setActive(true);
    speak("SOS khẩn cấp đã được kích hoạt. Đang xác định tọa độ GPS và chuẩn bị phương thức liên hệ.");

    if (!navigator.geolocation) {
      setLocationStatus("Thiết bị không hỗ trợ định vị Geolocation.");
      addIncident("Kích hoạt SOS — thiết bị không hỗ trợ GPS");
      return;
    }

    setLocationStatus("Đang định vị tọa độ chính xác...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newCoords = {
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          accuracy: Math.round(accuracy),
        };
        setCoords(newCoords);
        setLocationStatus(`Đã xác định vị trí: ${newCoords.lat}, ${newCoords.lng} (sai số ±${newCoords.accuracy}m).`);
        speak(`Đã lấy vị trí thành công. Tọa độ của bạn là ${newCoords.lat}, ${newCoords.lng}.`);
        addIncident(`Kích hoạt SOS thành công tại tọa độ ${newCoords.lat}, ${newCoords.lng} (±${newCoords.accuracy}m)`);
      },
      (err) => {
        const msg = err.code === 1 ? "Bị từ chối quyền truy cập vị trí" : "Không thể nhận diện tín hiệu GPS";
        setLocationStatus(`Lỗi GPS: ${msg}. Bạn hãy sử dụng các số hotline khẩn cấp bên dưới.`);
        speak(`Lỗi vị trí: ${msg}.`);
        addIncident(`Kích hoạt SOS — lỗi vị trí (${msg})`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function startCountdown() {
    if (active) return;
    setCountdown(3);
    speak("Chuẩn bị kích hoạt SOS trong 3 giây. Nhấn hủy nếu bạn bấm nhầm.");

    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timerRef.current);
        triggerImmediateSOS();
      }
    }, 1000);
  }

  function cancelCountdown() {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(null);
    speak("Đã hủy kích hoạt SOS.");
  }

  function clearHistory() {
    setHistory([]);
    try { localStorage.removeItem("we-sos-history"); } catch (_) {}
    speak("Đã xóa lịch sử sự cố.");
  }

  const mapLink = coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : null;
  const smsBody = coords
    ? `KHẨN CẤP: Tôi đang cần trợ giúp khẩn cấp. Vị trí của tôi: ${mapLink} (tọa độ: ${coords.lat}, ${coords.lng}).`
    : "KHẨN CẤP: Tôi đang cần trợ giúp khẩn cấp qua WayEcho.";

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <span aria-current="page" className="font-semibold text-ink">SOS Khẩn cấp</span>
      </nav>

      <div className="mt-4 max-w-3xl">
        <span className="chip hc-surface hc-border bg-red-100 text-red-900 font-bold">
          <PhoneIcon size={16} /> An toàn du khách & SOS
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold">SOS & Hỗ trợ khẩn cấp</h1>
        <p className="hc-muted mt-3 text-lg leading-relaxed text-ink-soft">
          Truy cập nhanh cứu trợ khẩn cấp, lấy tọa độ GPS chính xác và quay số trực tiếp đến các lực lượng cứu nạn, y tế hoặc người thân.
        </p>
      </div>

      {/* Main Activation Area (SOS01, SOS02, SOS03) */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-3xl bg-red-700 p-7 sm:p-8 text-white shadow-card flex flex-col justify-between" aria-labelledby="activate-sos">
          <div>
            <h2 id="activate-sos" className="text-3xl font-bold">Cần trợ giúp ngay lập tức?</h2>
            <p className="mt-3 text-red-100 text-base leading-relaxed">
              Nhấn nút để kích hoạt. Hệ thống có cơ chế đếm ngược 3 giây để tránh chạm nhầm, đồng thời cho phép kích hoạt ngay tức thì.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {countdown !== null ? (
              <div className="rounded-2xl bg-white p-6 text-center text-red-900">
                <p className="text-sm font-bold uppercase tracking-wider text-red-600">Đang đếm ngược</p>
                <p className="mt-1 text-5xl font-black">{countdown}</p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={cancelCountdown}
                    className="flex-1 rounded-xl bg-neutral-200 py-3 font-bold text-neutral-800 hover:bg-neutral-300"
                  >
                    HỦY (Bấm nhầm)
                  </button>
                  <button
                    type="button"
                    onClick={triggerImmediateSOS}
                    className="flex-1 rounded-xl bg-red-700 py-3 font-bold text-white hover:bg-red-800"
                  >
                    KÍCH HOẠT NGAY
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={startCountdown}
                className="flex min-h-[76px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 text-xl font-black text-red-800 transition hover:bg-red-50 focus:outline-white shadow-xl"
              >
                <PhoneIcon size={28} /> {active ? "SOS ĐÃ KÍCH HOẠT — CẬP NHẬT GPS" : "KÍCH HOẠT SOS KHẨN CẤP"}
              </button>
            )}

            {active && (
              <button
                type="button"
                onClick={() => { setActive(false); speak("Đã kết thúc phiên SOS."); }}
                className="w-full rounded-xl border border-white/40 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Kết thúc trạng thái SOS
              </button>
            )}
          </div>
        </section>

        {/* Live Status & Coordinates (SOS03, SOS05, SOS06) */}
        <section className="rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-card hc-surface hc-border" aria-labelledby="status-sos">
          <h2 id="status-sos" className="text-2xl font-bold">Trạng thái xử lý</h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3.5 rounded-2xl bg-surface-alt p-4 hc-surface hc-border">
              <MapPinIcon size={22} className="mt-0.5 shrink-0 text-red-600" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">Vị trí hiện tại (GPS)</p>
                <p className="hc-muted text-sm text-ink-soft mt-0.5">{locationStatus}</p>
                {coords && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary !min-h-[32px] !py-1 !px-3 font-semibold"
                    >
                      Mở Google Maps →
                    </a>
                    <button
                      type="button"
                      onClick={() => speak(`Tọa độ: vĩ độ ${coords.lat}, kinh độ ${coords.lng}.`)}
                      className="btn-ghost hc-border !min-h-[32px] !py-1 !px-3"
                    >
                      <SpeakerIcon size={14} /> Đọc tọa độ
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-surface-alt p-4 hc-surface hc-border">
              <CheckIcon size={22} className="mt-0.5 shrink-0 text-green-700" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">Liên hệ người thân (Emergency Contact)</p>
                {contactPhone ? (
                  <div className="mt-1 text-sm">
                    <p className="font-semibold text-ink">{contactName ? `${contactName}: ` : ""}{contactPhone}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <a
                        href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                        className="btn-primary !min-h-[32px] !py-1 !px-3"
                      >
                        <PhoneIcon size={14} /> Gọi ngay
                      </a>
                      <a
                        href={`sms:${contactPhone.replace(/\s+/g, "")}?body=${encodeURIComponent(smsBody)}`}
                        className="btn-ghost hc-border !min-h-[32px] !py-1 !px-3"
                      >
                        ✉ Gửi tin nhắn SMS kèm vị trí
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="hc-muted text-sm text-ink-soft">Chưa thiết lập số điện thoại người thân.</p>
                    <Link href="/profile" className="inline-block mt-2 text-xs font-bold text-accent-dark hover:underline">
                      + Thiết lập người liên hệ trong Hồ sơ →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Direct One-Touch Emergency Call Buttons (SOS04) */}
      <section className="mt-10" aria-labelledby="hotline-title">
        <h2 id="hotline-title" className="text-2xl font-bold">Các đầu số cứu nạn khẩn cấp tại Việt Nam</h2>
        <p className="hc-muted mt-1 text-sm text-ink-soft">Chạm vào số điện thoại để thực hiện cuộc gọi trực tiếp từ thiết bị:</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {EMERGENCY_SERVICES.map((s) => (
            <a
              key={s.number}
              href={`tel:${s.number}`}
              className="card hc-surface hc-border flex flex-col justify-between border-2 border-line p-5 hover:border-red-600 transition hover:shadow-card-hover"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-700">{s.name}</span>
                <p className="mt-1 text-4xl font-black text-ink">{s.number}</p>
                <p className="hc-muted mt-2 text-xs text-ink-soft leading-relaxed">{s.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-red-700">
                <PhoneIcon size={16} /> Gọi số {s.number} →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Fallback Hospital Directory (SOS08) */}
      <section className="mt-12 rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8" aria-labelledby="hospitals-title">
        <h2 id="hospitals-title" className="text-2xl font-bold flex items-center gap-2">
          🏥 Các bệnh viện cấp cứu lớn tại trung tâm Hà Nội (Phương án dự phòng)
        </h2>
        <p className="hc-muted mt-1 text-sm text-ink-soft">
          Trong trường hợp mất mạng hoặc lỗi định vị GPS, bạn có thể gọi trực tiếp hoặc nhờ người đi đường đưa tới các cơ sở y tế gần nhất:
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {MAJOR_HOSPITALS.map((h) => (
            <div key={h.name} className="rounded-2xl border border-line p-4 hc-border">
              <h3 className="font-bold text-base">{h.name}</h3>
              <p className="text-xs text-ink-soft hc-muted mt-1 leading-relaxed">{h.address}</p>
              <a
                href={`tel:${h.phone}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent-dark hover:underline"
              >
                <PhoneIcon size={14} /> Hotline: {h.phone}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Incident History Log (SOS07) */}
      {history.length > 0 && (
        <section className="mt-10 rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="history-title">
          <div className="flex items-center justify-between border-b border-line pb-3 hc-border">
            <h2 id="history-title" className="text-xl font-bold">Lịch sử kích hoạt SOS trên thiết bị</h2>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              <TrashIcon size={14} /> Xóa lịch sử
            </button>
          </div>

          <ul className="mt-4 space-y-2.5">
            {history.map((rec) => (
              <li key={rec.id} className="flex items-center justify-between text-sm border-b border-line pb-2 hc-border">
                <div>
                  <span className="font-semibold text-ink">{rec.detail}</span>
                  <span className="block text-xs text-ink-soft hc-muted">{rec.date} lúc {rec.time}</span>
                </div>
                <span className="text-xs font-bold text-green-700">Đã lưu cục bộ</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mandatory Disclaimer */}
      <div className="mt-8 rounded-2xl border border-red-300 bg-red-50 p-5 text-red-950 hc-border" role="note">
        <strong>Lưu ý an toàn bắt buộc:</strong> Bản web WayEcho cung cấp công cụ định vị và danh bạ cứu hộ hỗ trợ. Trong tình huống khẩn cấp nguy hiểm đến tính mạng hoặc sức khỏe, hãy luôn ưu tiên sử dụng chức năng gọi điện thoại trực tiếp đến đầu số <strong>115</strong> hoặc thông báo to bằng lời nói với người dân xung quanh để nhận được trợ giúp ngay lập tức.
      </div>
    </div>
  );
}

