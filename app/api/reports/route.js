import { NextResponse } from "next/server";
import { list, add, update } from "@/lib/store";
import { readJson, badRequest, cleanText, REPORT_STATUSES } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const place = searchParams.get("place");
  const all = await list("reports");
  return NextResponse.json(place ? all.filter((r) => r.itemId === place) : all);
}

export async function POST(req) {
  const body = await readJson(req);
  if (!body) return badRequest("Dữ liệu gửi lên không phải JSON hợp lệ");
  if (!cleanText(body.itemId)) return badRequest("Thiếu itemId");
  if (!cleanText(body.category)) return badRequest("Thiếu loại báo cáo");
  if (!cleanText(body.description)) return badRequest("Vui lòng nhập nội dung mô tả sai lệch");

  const record = await add("reports", {
    itemId: cleanText(body.itemId, 100),
    itemName: cleanText(body.itemName, 200),
    category: cleanText(body.category, 100),
    description: cleanText(body.description, 2000),
    reporterName: cleanText(body.reporterName, 80) || "Du khách ẩn danh",
    reporterContact: cleanText(body.reporterContact, 120) || "",
    status: "pending_review", // pending_review | verified | dismissed
  });

  return NextResponse.json(record, { status: 201 });
}

export async function PATCH(req) {
  const body = await readJson(req);
  if (!body?.id || !REPORT_STATUSES.includes(body?.status)) return badRequest("Thiếu id hoặc trạng thái không hợp lệ");
  const updated = await update("reports", body.id, { status: body.status });
  return NextResponse.json(updated || { error: "Không tìm thấy" }, { status: updated ? 200 : 404 });
}
