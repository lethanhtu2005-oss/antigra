"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getItem } from "@/data/catalog";
import { getDestination } from "@/data/destinations";
import { StarIcon, CheckIcon, MapPinIcon } from "@/components/Icons";

const CRITERIA = [
  { key: "entrance", label: "Lối vào & Bậc dốc tiếp cận" },
  { key: "navigation", label: "Khả năng di chuyển nội khu" },
  { key: "staff", label: "Thái độ & Hỗ trợ của nhân viên" },
  { key: "toilet", label: "Nhà vệ sinh tiếp cận" },
  { key: "info", label: "Thông tin & Biển chỉ dẫn chữ lớn" },
  { key: "audio", label: "Thuyết minh âm thanh / Audio guide" },
];

const REPORT_CATEGORIES = [
  "Lối đi bị chặn hoặc chướng ngại vật nguy hiểm",
  "Đường dẫn xúc giác / Bậc tam cấp hư hại hoặc thiếu dốc",
  "Thiết bị thuyết minh âm thanh / Audio guide không hoạt động",
  "Nhà vệ sinh tiếp cận bị khóa hoặc không sử dụng được",
  "Cơ sở từ chối tiếp nhận Chó dẫn đường",
  "Thông tin giá vé / Chính sách giảm giá người khuyết tật sai lệch",
  "Khác",
];

function Stars({ value, onChange, label }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line py-3 hc-border">
      <span className="font-semibold text-sm sm:text-base">{label}</span>
      <span className="flex gap-1" role="radiogroup" aria-label={`Chấm điểm ${label}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} sao cho ${label}`}
            onClick={() => onChange(n)}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              n <= value ? "text-primary scale-105" : "text-line hover:text-primary/60"
            }`}
          >
            <StarIcon size={26} filled={n <= value} />
          </button>
        ))}
      </span>
    </div>
  );
}

function ReviewContent() {
  const params = useSearchParams();
  const itemParam = params.get("item");
  const actionParam = params.get("action");

  // Determine item target
  const targetPlace = getDestination(itemParam) || getItem(itemParam);

  const { speak } = useA11y();
  const [activeTab, setActiveTab] = useState(actionParam === "report" ? "report" : "review");

  // Review state
  const [ratings, setRatings] = useState({
    entrance: 0,
    navigation: 0,
    staff: 0,
    toilet: 0,
    info: 0,
    audio: 0,
  });
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");

  // Report state
  const [reportCat, setReportCat] = useState(REPORT_CATEGORIES[0]);
  const [reportDesc, setReportDesc] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedType, setSubmittedType] = useState(null); // 'review' | 'report' | null
  const [errorMsg, setErrorMsg] = useState("");

  async function submitReview(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!Object.values(ratings).some((v) => v > 0) && !comment.trim()) {
      setErrorMsg("Vui lòng chấm ít nhất một tiêu chí hoặc nhập nhận xét.");
      speak("Vui lòng chấm ít nhất một tiêu chí hoặc nhập nhận xét.");
      return;
    }
    setSubmitting(true);
    try {
      await api.createReview({
        itemId: targetPlace?.slug || targetPlace?.id || itemParam || "unknown",
        itemName: targetPlace?.name || itemParam || "Địa điểm chưa xác định",
        author: author || "Du khách ẩn danh",
        comment,
        ratings,
      });
      setSubmittedType("review");
      speak("Cảm ơn bạn đã gửi đánh giá tiếp cận. Thông tin này sẽ giúp ích rất nhiều cho cộng đồng người khiếm thị khi đi lại.");
    } catch (err) {
      setErrorMsg("Không thể gửi đánh giá. Vui lòng thử lại sau.");
      speak("Gửi đánh giá chưa thành công.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReport(e) {
    e.preventDefault();
    if (!reportDesc.trim()) {
      setErrorMsg("Vui lòng nhập mô tả chi tiết thông tin sai lệch.");
      speak("Vui lòng nhập mô tả chi tiết thông tin sai lệch.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await api.createReport({
        itemId: targetPlace?.slug || targetPlace?.id || itemParam || "unknown",
        itemName: targetPlace?.name || itemParam || "Địa điểm chưa xác định",
        category: reportCat,
        description: reportDesc,
        reporterName: reporterName || "Du khách ẩn danh",
        reporterContact,
      });
      setSubmittedType("report");
      speak("Cảm ơn bạn đã báo cáo thông tin tiếp cận sai. Đội ngũ kiểm duyệt sẽ đối chiếu thực tế và cập nhật dữ liệu.");
    } catch (err) {
      setErrorMsg("Gửi báo cáo chưa thành công. Vui lòng kiểm tra lại kết nối mạng.");
      speak("Gửi báo cáo chưa thành công.");
    } finally {
      setSubmitting(false);
    }
  }

  const backLink = targetPlace?.slug
    ? `/destination?d=${targetPlace.slug}`
    : targetPlace?.id
    ? `/item?id=${targetPlace.id}`
    : "/explore";

  if (submittedType) {
    return (
      <div className="container-page py-16 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-800">
          <CheckIcon size={40} />
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-bold">
          {submittedType === "report" ? "Đã ghi nhận báo cáo sai lệch!" : "Cảm ơn bạn đã đánh giá!"}
        </h1>
        <p className="hc-muted mt-3 max-w-xl mx-auto text-lg text-ink-soft">
          {submittedType === "report"
            ? "Báo cáo của bạn về thông tin tiếp cận đã được lưu và chuyển tới đội ngũ kiểm duyệt dữ liệu thực địa của WayEcho."
            : "Đánh giá chi tiết của bạn đã được ghi nhận và sẽ giúp các du khách khiếm thị khác tự tin hơn khi lên kế hoạch hành trình."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={backLink} className="btn-primary">
            Quay lại {targetPlace?.name || "địa điểm"}
          </Link>
          <Link href="/" className="btn-ghost hc-border">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <p className="text-sm text-ink-soft hc-muted">
          <Link href="/" className="hover:underline">Trang chủ</Link> ·{" "}
          <Link href={backLink} className="hover:underline">{targetPlace?.name || "Địa điểm"}</Link> · Phản hồi tiếp cận
        </p>

        {targetPlace && (
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPinIcon size={18} />
            <span>Địa điểm: {targetPlace.name} ({targetPlace.area || "Hà Nội"})</span>
          </div>
        )}

        <h1 className="mt-2 text-3xl sm:text-5xl font-bold">
          {activeTab === "report" ? "Báo cáo thông tin tiếp cận sai" : "Đánh giá trải nghiệm tiếp cận"}
        </h1>
        <p className="hc-muted mt-3 text-lg text-ink-soft">
          Đóng góp của bạn giúp cộng đồng người khiếm thị và người nhìn kém tại Hà Nội nắm bắt dữ liệu chính xác và an toàn nhất.
        </p>

        {/* Tab switchers */}
        <div className="mt-6 flex gap-2 border-b border-line pb-2 hc-border">
          <button
            type="button"
            onClick={() => { setActiveTab("review"); setErrorMsg(""); }}
            className={`min-h-[44px] rounded-full px-5 py-2 text-sm font-bold transition ${
              activeTab === "review"
                ? "bg-primary text-ink shadow-sm"
                : "bg-surface-alt text-ink-soft hover:bg-white hc-surface hc-border"
            }`}
          >
            ★ Đánh giá tiếp cận (1–5 sao)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("report"); setErrorMsg(""); }}
            className={`min-h-[44px] rounded-full px-5 py-2 text-sm font-bold transition ${
              activeTab === "report"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-surface-alt text-ink-soft hover:bg-white hc-surface hc-border"
            }`}
          >
            ⚠ Báo cáo thông tin sai lệch
          </button>
        </div>

        {errorMsg && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Form 1: Đánh giá tiếp cận */}
        {activeTab === "review" && (
          <form onSubmit={submitReview} className="mt-6 space-y-6">
            <div className="rounded-[20px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
              <h2 className="text-xl font-bold mb-2">Chấm điểm theo tiêu chí WCAG & Thực địa</h2>
              <p className="text-xs text-ink-soft hc-muted mb-4">Chọn từ 1 đến 5 sao cho các mục bạn đã trải nghiệm. Mục nào chưa trải nghiệm có thể để trống (không tính điểm).</p>
              {CRITERIA.map((c) => (
                <Stars
                  key={c.key}
                  label={c.label}
                  value={ratings[c.key]}
                  onChange={(n) => setRatings((r) => ({ ...r, [c.key]: n }))}
                />
              ))}
            </div>

            <div>
              <label htmlFor="author" className="mb-1 block font-semibold">Tên hiển thị (không bắt buộc)</label>
              <input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ví dụ: Minh Đức (Người khiếm thị)"
                className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-base outline-none hc-surface hc-border focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="comment" className="mb-1 block font-semibold">Nhận xét chi tiết</label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Điều gì giúp bạn tiếp cận dễ dàng? Có lối dốc hay đường dẫn xúc giác không? Nhân viên có hỗ trợ tận tình không?"
                className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-base outline-none hc-surface hc-border focus:border-primary"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary text-lg w-full sm:w-auto">
              <CheckIcon size={22} /> {submitting ? "Đang gửi..." : "Gửi đánh giá tiếp cận"}
            </button>
          </form>
        )}

        {/* Form 2: Báo cáo thông tin sai */}
        {activeTab === "report" && (
          <form onSubmit={submitReport} className="mt-6 space-y-6">
            <div className="rounded-[20px] border border-amber-300 bg-amber-50/50 p-6 shadow-card hc-surface hc-border">
              <h2 className="text-xl font-bold text-amber-950 mb-1">Báo cáo sai lệch dữ liệu</h2>
              <p className="text-sm text-amber-900 hc-muted">
                Nếu bạn phát hiện thông tin về lối đi, dốc xe lăn, thiết bị audio guide, chính sách chó dẫn đường hoặc giá vé tại địa điểm này không đúng thực tế, hãy thông báo ngay để chúng tôi cập nhật.
              </p>
            </div>

            <div>
              <label htmlFor="report-category" className="mb-1 block font-semibold">Loại vấn đề cần báo cáo *</label>
              <select
                id="report-category"
                value={reportCat}
                onChange={(e) => setReportCat(e.target.value)}
                className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-base outline-none hc-surface hc-border focus:border-primary"
              >
                {REPORT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="report-desc" className="mb-1 block font-semibold">Mô tả cụ thể sai lệch hoặc chướng ngại vật *</label>
              <textarea
                id="report-desc"
                rows={4}
                required
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Ví dụ: Cổng sau Văn Miếu hiện đang thi công, không có dốc cho xe lăn. Lối đi bên phải Hồ Gươm có hàng rào chắn thi công vỉa hè..."
                className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-base outline-none hc-surface hc-border focus:border-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="reporter-name" className="mb-1 block font-semibold">Họ tên của bạn (tùy chọn)</label>
                <input
                  id="reporter-name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Tuấn"
                  className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-base outline-none hc-surface hc-border focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="reporter-contact" className="mb-1 block font-semibold">Số điện thoại hoặc Email (tùy chọn)</label>
                <input
                  id="reporter-contact"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Để Ban quản trị liên hệ đối chiếu"
                  className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-base outline-none hc-surface hc-border focus:border-primary"
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary text-lg w-full sm:w-auto !bg-red-600 hover:!bg-red-700 !text-white">
              <CheckIcon size={22} /> {submitting ? "Đang gửi báo cáo..." : "Gửi báo cáo sai lệch"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải biểu mẫu…</div>}>
      <ReviewContent />
    </Suspense>
  );
}
