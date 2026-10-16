"use client";

import { useEffect, useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getItem } from "@/data/catalog";
import { StarIcon } from "@/components/Icons";

const REPORT_LABEL = { pending_review: "Chờ duyệt", verified: "Đã xác nhận", dismissed: "Bỏ qua" };

export default function AdminModeration() {
  const { speak } = useA11y();
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.listReviews(null, { all: true }), api.listReports()])
      .then(([rv, rp]) => { setReviews(rv); setReports(rp); })
      .catch(() => setError("Không tải được dữ liệu kiểm duyệt."))
      .finally(() => setLoading(false));
  }, []);

  async function toggleHidden(r) {
    try {
      const updated = await api.setReviewHidden(r.id, !r.hidden);
      setReviews((list) => list.map((x) => (x.id === r.id ? updated : x)));
      speak(updated.hidden ? "Đã ẩn đánh giá." : "Đã hiện lại đánh giá.");
    } catch (_) { speak("Không lưu được thay đổi."); }
  }

  async function setReportStatus(rp, status) {
    try {
      const updated = await api.updateReport(rp.id, status);
      setReports((list) => list.map((x) => (x.id === rp.id ? updated : x)));
      speak(`Báo cáo: ${REPORT_LABEL[status]}.`);
    } catch (_) { speak("Không lưu được thay đổi."); }
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Kiểm duyệt</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Duyệt đánh giá và báo cáo sai lệch của khách. Không sửa điểm khách chấm.</p>
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : (
        <>
          <h2 className="mt-8 text-2xl">Báo cáo sai lệch dữ liệu ({reports.length})</h2>
          {reports.length === 0 ? (
            <p className="mt-3 text-ink-soft">Chưa có báo cáo nào.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reports.map((rp) => (
                <li key={rp.id} className="card hc-surface hc-border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{getItem(rp.itemId)?.name || rp.itemName || "Địa điểm"} · {rp.category}</p>
                    <span className="rounded-pill bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{REPORT_LABEL[rp.status] || rp.status}</span>
                  </div>
                  <p className="hc-muted text-sm text-ink-soft">Bởi {rp.reporterName}{rp.reporterContact ? ` · ${rp.reporterContact}` : ""}</p>
                  <p className="mt-2">{rp.description}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setReportStatus(rp, "verified")} className="btn-primary !py-2 text-sm">Xác nhận sai lệch</button>
                    <button onClick={() => setReportStatus(rp, "dismissed")} className="btn-ghost hc-border !py-2 text-sm">Bỏ qua</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-10 text-2xl">Đánh giá ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="mt-3 text-ink-soft">Chưa có đánh giá nào cần kiểm duyệt.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className={`card hc-surface hc-border p-5 ${r.hidden ? "opacity-60" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{getItem(r.itemId)?.name || r.itemName || "Dịch vụ"}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-primary"><StarIcon size={14} /> {r.ratings?.entrance || "-"}/5 lối vào</span>
                  </div>
                  <p className="hc-muted text-sm text-ink-soft">Bởi {r.author}{r.hidden ? " · đang bị ẩn" : ""}</p>
                  {r.comment && <p className="mt-2">“{r.comment}”</p>}
                  <button onClick={() => toggleHidden(r)} className="btn-ghost hc-border mt-3 !py-2 text-sm">
                    {r.hidden ? "Hiện lại" : "Ẩn nội dung vi phạm"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
