import { NextResponse } from "next/server";
import { list, add, update } from "@/lib/store";
import { readJson, badRequest, cleanText, rating } from "@/lib/validate";

const CRITERIA = ["entrance", "navigation", "staff", "toilet", "info", "audio"];

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const place = searchParams.get("place");
  const all = await list("reviews");
  const filtered = place ? all.filter((r) => r.itemId === place) : all;
  // Admin xem tất cả (?all=1); người dùng thường không thấy nội dung đã bị ẩn.
  return NextResponse.json(searchParams.get("all") === "1" ? filtered : filtered.filter((r) => !r.hidden));
}

export async function POST(req) {
  const body = await readJson(req);
  if (!body) return badRequest("Dữ liệu gửi lên không phải JSON hợp lệ");
  if (!cleanText(body.itemId)) return badRequest("Thiếu itemId");
  const ratings = {};
  for (const key of CRITERIA) {
    const value = rating(body.ratings?.[key]);
    if (value === null) return badRequest(`Điểm "${key}" phải là số nguyên từ 1 đến 5`);
    ratings[key] = value;
  }
  if (!Object.values(ratings).some((v) => v > 0) && !cleanText(body.comment)) {
    return badRequest("Vui lòng chấm ít nhất một tiêu chí hoặc nhập nhận xét");
  }
  const record = await add("reviews", {
    itemId: cleanText(body.itemId, 100),
    itemName: cleanText(body.itemName, 200),
    author: cleanText(body.author, 80) || "Khách ẩn danh",
    comment: cleanText(body.comment, 2000),
    // Đánh giá tiếp cận theo tiêu chí (1–5)
    ratings,
  });
  return NextResponse.json(record, { status: 201 });
}

// Admin ẩn / hiện lại một đánh giá (không sửa điểm khách chấm).
export async function PATCH(req) {
  const body = await readJson(req);
  if (!body?.id || typeof body.hidden !== "boolean") return badRequest("Thiếu id hoặc trạng thái hidden");
  const updated = await update("reviews", body.id, { hidden: body.hidden });
  return NextResponse.json(updated || { error: "Không tìm thấy" }, { status: updated ? 200 : 404 });
}
