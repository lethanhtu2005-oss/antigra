import test from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, byCategory, catLabel, getItem } from "../data/catalog.js";
import { destinations, getDestination } from "../data/destinations.js";
import { articles } from "../data/articles.js";

test("CATEGORIES chứa đầy đủ danh mục chính và danh mục Chó dẫn đường", () => {
  const ids = CATEGORIES.map((c) => c.id);
  assert.ok(ids.includes("all"), "Thiếu danh mục all");
  assert.ok(ids.includes("destination"), "Thiếu danh mục destination");
  assert.ok(ids.includes("guidedog"), "Thiếu danh mục guidedog");
  assert.ok(ids.includes("accommodation"), "Thiếu danh mục accommodation");
  assert.ok(ids.includes("ticket"), "Thiếu danh mục ticket");
});

test("byCategory lọc chính xác cho all và guidedog", () => {
  const all = byCategory("all");
  assert.ok(all.length >= 10, "Tổng số mục phải có ít nhất 10");

  const guideDogItems = byCategory("guidedog");
  assert.ok(guideDogItems.length > 0, "Phải có ít nhất 1 dịch vụ chó dẫn đường");
  assert.ok(guideDogItems.some((x) => x.id === "demo-guide-dog"));
});

test("catLabel trả về nhãn mô tả tiếng Việt thân thiện", () => {
  assert.equal(catLabel("all"), "Tất cả dịch vụ & điểm đến");
  assert.equal(catLabel("guidedog"), "Dịch vụ đồng hành cùng Chó dẫn đường");
  assert.equal(catLabel("destination"), "Điểm đến");
});

test("getItem tìm thấy cả id và destinationSlug", () => {
  const hg = getItem("ho-guom");
  assert.ok(hg, "Không tìm thấy Hồ Gươm theo slug");
  assert.equal(hg.name, "Hồ Hoàn Kiếm & Cầu Thê Húc");

  const dog = getItem("demo-guide-dog");
  assert.ok(dog, "Không tìm thấy demo-guide-dog");
});

test("destinations có đầy đủ tọa độ, audio và dữ liệu accessibility", () => {
  assert.ok(destinations.length >= 6, "Phải có ít nhất 6 điểm đến demo");
  for (const d of destinations) {
    assert.ok(d.slug, "Thiếu slug");
    assert.ok(d.name, "Thiếu name");
    assert.ok(d.coordinates?.lat && d.coordinates?.lng, `Thiếu tọa độ cho ${d.slug}`);
    assert.ok(d.access?.level, `Thiếu access.level cho ${d.slug}`);
    assert.ok(d.audio, `Thiếu audio mô tả cho ${d.slug}`);
  }
});

test("articles chứa đầy đủ 4 cẩm nang có mục lục TOC và hình ảnh", () => {
  assert.equal(articles.length, 4, "Phải có đúng 4 bài viết cẩm nang");
  for (const a of articles) {
    assert.ok(a.slug, "Thiếu slug bài viết");
    assert.ok(a.title, "Thiếu tiêu đề bài viết");
    assert.ok(Array.isArray(a.toc) && a.toc.length > 0, `Thiếu TOC cho bài ${a.slug}`);
    assert.ok(Array.isArray(a.content) && a.content.length > 0, `Thiếu content cho bài ${a.slug}`);
    assert.ok(a.image && a.alt, `Thiếu ảnh hoặc alt cho bài ${a.slug}`);
  }
});
