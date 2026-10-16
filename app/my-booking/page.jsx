"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { CalendarIcon, SpeakerIcon, CheckIcon } from "@/components/Icons";

const STATUS_MAP = {
  pending: { label: "Đang chờ tiếp nhận", style: "bg-amber-100 text-amber-900" },
  confirmed: { label: "Đã xác nhận", style: "bg-green-100 text-green-900" },
  rejected: { label: "Bị từ chối", style: "bg-red-100 text-red-900" },
  cancelled: { label: "Đã hủy", style: "bg-neutral-200 text-neutral-800" },
  completed: { label: "Đã hoàn tất", style: "bg-blue-100 text-blue-900" },
};

export default function MyBookingPage() {
  const { speak } = useA11y();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    try {
      const data = await api.listBookings();
      setBookings(data || []);
    } catch (_) {} finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function cancelBooking(id, itemName) {
    try {
      await api.updateBooking(id, "cancelled");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      speak(`Đã hủy đặt chỗ cho ${itemName}.`);
    } catch (_) {
      speak("Không thể hủy đặt chỗ, vui lòng thử lại.");
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Đặt chỗ của tôi</h1>
      <p className="hc-muted mt-3 max-w-2xl text-lg text-ink-soft">
        Tất cả tour, phòng và dịch vụ bạn đã đặt. Trạng thái tiếp nhận được cập nhật theo dữ liệu thực tế.
      </p>

      {loading ? (
        <p className="mt-8 text-ink-soft">Đang tải…</p>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Bạn chưa có đặt chỗ nào.</p>
          <Link href="/services" className="btn-primary mt-4">Khám phá dịch vụ</Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((b) => {
            const st = STATUS_MAP[b.status] || {
              label: b.demo ? "Đã gửi (Demo)" : "Đang chờ tiếp nhận",
              style: "bg-amber-100 text-amber-900",
            };
            const canCancel = b.status !== "cancelled" && b.status !== "rejected";

            return (
              <li key={b.id} className="card hc-surface hc-border flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${b.status === "cancelled" ? "bg-neutral-200 text-neutral-700" : "bg-green-100 text-green-800"}`}>
                  <CheckIcon size={24} />
                </span>
                <div className="flex-1">
                  <p className="text-xl font-semibold">{b.itemName}</p>
                  <p className="hc-muted flex flex-wrap items-center gap-x-3 text-ink-soft text-sm mt-1">
                    <span className="flex items-center gap-1"><CalendarIcon size={15} /> {b.date || "—"} · {b.time || "—"}</span>
                    <span>{b.guests} khách</span>
                    {b.assist && <span className="font-semibold text-accent-dark">Có người hỗ trợ</span>}
                    {b.price && <span className="font-bold text-ink">{b.price}</span>}
                  </p>
                  {b.accessibilityRequests && b.accessibilityRequests.length > 0 && (
                    <p className="text-xs text-ink-soft hc-muted mt-1">
                      Yêu cầu hỗ trợ: {b.accessibilityRequests.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip hc-surface hc-border ${st.style}`}>{st.label}</span>
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.id, b.itemName)}
                      className="btn-ghost hc-border !min-h-[36px] !py-1 !px-3 text-xs text-red-700 hover:bg-red-50"
                      aria-label={`Hủy đặt chỗ ${b.itemName}`}
                    >
                      Hủy đơn
                    </button>
                  )}
                  <button
                    onClick={() => speak(`${b.itemName}, trạng thái: ${st.label}, ${b.time || ""} ${b.date || ""}, ${b.guests} khách${b.assist ? ", có người hỗ trợ" : ""}.`)}
                    className="btn-ghost hc-border !min-h-[36px] !p-2" aria-label={`Nghe lại đơn ${b.itemName}`}
                  ><SpeakerIcon size={18} /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
