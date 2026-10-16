# WAYECHO — NHẬT KÝ THAY ĐỔI & HOÀN THIỆN HỆ THỐNG (CHANGELOG)

Dự án: **WayEcho — Nền tảng du lịch tiếp cận dành cho du khách khiếm thị tại Hà Nội**  
Căn cứ triển khai: Tài liệu `BẢNG TỔNG HỢP FUNCTION 2 SAU SỬA(2).docx` và source code gốc.  
Môi trường: Next.js 16.3.6 (Turbopack) · React 19.3.0 · Tailwind CSS 3.4.13.  
Thời gian hoàn thành: 17/10/2026.

---

## 1. TỔNG QUAN CÁC HẠNG MỤC ĐÃ TRIỂN KHAI VÀ HOÀN THIỆN

### ƯU TIÊN 1 & 2: SỬA LỖI HỆ THỐNG & HOÀN THIỆN LUỒNG NGHIỆP VỤ

1. **Khắc phục lỗi điều hướng và tra cứu sản phẩm (`data/catalog.js` & `app/item/ItemView.jsx`)**:
   - Khắc phục lỗi trang chủ truyền param `slug=ho-guom` nhưng trang chi tiết chỉ lọc theo `id`. Đã cập nhật hàm `getItem(idOrSlug)` tra cứu linh hoạt theo cả `x.id` và `x.destinationSlug`.
   - Kết nối trực tiếp các thẻ điểm đến trên trang chủ tới giao diện chi tiết đầy đủ `/destination?d=${slug}`.

2. **Khắc phục lỗi trạng thái đơn đặt chỗ (`app/my-booking/page.jsx`)**:
   - Khắc phục lỗi hardcode trạng thái "Đã xác nhận" trên tất cả các đơn đặt.
   - Hiện đã render chính xác badge trạng thái động: `Chờ xác nhận` (pending), `Đã xác nhận` (confirmed), `Từ chối` (rejected), `Đã hủy` (cancelled), `Đã hoàn thành` (completed).
   - Bổ sung chức năng Hủy đơn đặt trực tiếp (`cancelBooking`) có hộp thoại xác nhận và giọng đọc TTS thông báo.

3. **Hoàn thiện tài khoản du khách & Hồ sơ tiếp cận (`app/profile/page.jsx`) (FR01 - FR06)**:
   - **FR01 (Đăng nhập / Đăng ký)**: Tích hợp Modal đăng nhập và đăng ký dành cho Traveler, form validation đầy đủ, lưu trữ phiên người dùng an toàn vào `we-user` và hiển thị lời chào cá nhân hóa trên Header.
   - **FR02 (Hồ sơ cá nhân & Ghi chú y tế)**: Cập nhật họ tên, điện thoại, năm sinh, lưu ý sức khỏe/trợ giúp đặc biệt.
   - **FR03 & FR04 (Tùy chọn trợ năng chuyên biệt)**: Chuyển đổi linh hoạt giữa chế độ Mù hoàn toàn (Blind - ưu tiên Screen reader/Audio) và Nhìn kém (Low Vision - ưu tiên Chữ lớn, Tương phản cao). Thanh trượt điều chỉnh tốc độ giọng đọc TTS (0.75x - 1.5x).
   - **FR05 (Quản lý liên hệ khẩn cấp Emergency Contact)**: Lưu tên và số điện thoại người thân để tự động nạp vào luồng SOS khẩn cấp.
   - **FR06 (Cài đặt quyền riêng tư)**: Công tắc bật/tắt chia sẻ tọa độ GPS và chia sẻ nhu cầu tiếp cận với nhà cung cấp dịch vụ.

4. **Triển khai API và Form Báo cáo thông tin tiếp cận sai (`app/api/reports/route.js` & `app/review/page.jsx`) (RV01, RV02)**:
   - Tạo mới API endpoint `POST /api/reports` và `GET /api/reports` lưu trữ dữ liệu vào hệ thống store.
   - Xây dựng giao diện chuyển đổi giữa 2 tab:
     - **Đánh giá tiếp cận (RV01)**: Chấm điểm 1–5 sao theo 6 tiêu chí tiếp cận (Lối vào & Bậc dốc, Di chuyển nội khu, Nhân viên hỗ trợ, Nhà vệ sinh tiếp cận, Thông tin & Biển chỉ dẫn chữ lớn, Audio guide).
     - **Báo cáo sai lệch (RV02)**: Báo cáo lối đi bị chặn, đường dẫn xúc giác hư hại, loa thuyết minh không hoạt động, từ chối chó dẫn đường, sai giá vé... có phản hồi giọng nói và lưu vết kiểm duyệt.

---

### ƯU TIÊN 3: GIAO DIỆN UI/UX, BỐ CỤC & TÍNH NHẤT QUÁN

1. **Đồng bộ Theme Sáng / Tối (Dark / Light Mode) (UI02, FR04)**:
   - Nâng cấp `components/A11yProvider.jsx` với state `theme` (`light` | `dark`), lưu vào `localStorage ("we-theme")`, cập nhật `data-theme="dark"` và class `.dark` trên thẻ `<html>`.
   - Bổ sung biến màu CSS Dark mode trong `app/globals.css`, đồng bộ toàn bộ card surfaces, borders, inputs, text colors và high contrast mode.
   - Thêm nút chuyển đổi Giao diện nhanh trên `components/AccessibilityToolbar.jsx` và `components/Header.jsx`.

2. **Hợp nhất và tối ưu hóa Trang chủ (`app/page.jsx`) (UI03, UI07)**:
   - Hợp nhất 4 khối nội dung trùng lặp trước đây thành 2 khối hiện đại, tinh gọn:
     1. Khối *Trợ lý thông minh trên từng bước đi*: Giọng nói, Camera AI, Chỉ đường âm thanh, Chó dẫn đường & Guide.
     2. Khối *Hành trình 4 bước cùng WayEcho*: Khám phá -> Kiểm tra tiếp cận -> Đặt dịch vụ & Hỗ trợ -> Tự tin trải nghiệm.
   - Tích hợp Component Thư viện ảnh tương tác `<HomeGallery />`.
   - Cập nhật Header menu chuẩn: *Trang chủ*, *Khám phá*, *Dịch vụ*, *Cẩm nang*, *Hỗ trợ*, *Đối tác*.

3. **Thư viện ảnh và Lightbox tương tác (`components/ImageGalleryModal.jsx` & `components/HomeGallery.jsx`) (UI04, UI05, CT06)**:
   - Hỗ trợ xem ảnh kích thước lớn, văn bản thay thế chi tiết (Alt text) cho người khiếm thị.
   - Điều hướng bàn phím đầy đủ (`ArrowLeft`, `ArrowRight`, `Escape`).
   - Tích hợp nút đọc thuyết minh hình ảnh bằng giọng nói TTS (`speak()`).
   - Liên kết trực tiếp tới trang chi tiết của địa danh đang xem.

---

### ƯU TIÊN 4: DỊCH VỤ DU LỊCH & CHUYÊN ĐỀ CHÓ DẪN ĐƯỜNG (GUIDE DOG)

1. **Trang Danh mục Dịch vụ tập trung (`app/services/page.jsx`) (SV01 - SV10)**:
   - Bao quát toàn diện các nhóm dịch vụ: Lưu trú tiếp cận (Accommodation), Phương tiện di chuyển (Transport), Vé tham quan (Tickets) có trích dẫn chính sách miễn giảm theo **Nghị định 28/2012/NĐ-CP**, Hướng dẫn viên & Trợ lý đồng hành (Guides), Dịch vụ đồng hành cùng Chó dẫn đường (Guide Dog).
   - Nhãn minh bạch dữ liệu: Ghi rõ mục DEMO đối với các nhà cung cấp giả định, minh bạch chính sách xác minh.

2. **Chuyên đề Chó dẫn đường tại Hà Nội (`app/services/guide-dog/page.jsx` & `app/guide-dog/page.jsx`) (SV07)**:
   - Cung cấp hành lang pháp lý dựa trên **Luật Người khuyết tật số 51/2010/QH12 (Điều 12, Điều 40)** và **Thông tư 29/2021/TT-BGTVT**.
   - Khảo sát các điểm đến thân thiện với chó dẫn đường tại Hà Nội: Hồ Hoàn Kiếm, Hồ Tây, Văn Miếu, Phố đi bộ.
   - 4 nguyên tắc ứng xử vàng nơi công cộng: Không vuốt ve khi chó đang làm việc, Không cho ăn, Không gọi tên/gây phân tâm, Luôn hỏi ý kiến người sử dụng chó trước.

3. **Bổ sung danh mục Khám phá (`data/catalog.js` & `app/explore/page.jsx`) (EX01)**:
   - Thêm tab "Tất cả" (`cat=all`) và tab "Chó dẫn đường" (`cat=guidedog`).
   - Hiển thị card cẩm nang chuyên sâu nổi bật khi du khách lọc danh mục Chó dẫn đường.

---

### ƯU TIÊN 5: CAMERA AI, GIỌNG NÓI & AN TOÀN KHẨN CẤP SOS

1. **Trợ lý Camera AI thị giác (`app/assistant/page.jsx`) (AI01 - AI11)**:
   - Nhận diện luồng camera thời gian thực qua `navigator.mediaDevices.getUserMedia`.
   - Hỗ trợ đổi camera Trước/Sau, chụp ảnh canvas hoặc tải ảnh từ máy.
   - **Thuật toán kiểm tra độ sáng ảnh (AI07)**: Cảnh báo tự động bằng giọng nói khi ảnh quá tối (Luminance < 35) hoặc bị lóa sáng (Luminance > 245).
   - 2 chế độ chuyên biệt: "Mô tả toàn cảnh" và "Đọc biển báo / OCR".
   - Tự động phát âm thanh kết quả nhận diện, lưu lịch sử quét vào máy (`we-ai-history`).
   - Tuyên bố bảo mật và minh bạch AI (AI11).

2. **Bản đồ & Điều hướng giọng nói nâng cao (`app/navigation/page.jsx`) (EX10, AI12)**:
   - Cho phép chọn điểm đến bất kỳ trong danh sách địa danh Hà Nội (Hồ Gươm, Văn Miếu, Phố cổ, Hồ Tây, Nhà hát Lớn, Hoàng thành Thăng Long...).
   - **Xác định vị trí GPS thực tế**: Tính khoảng cách chính xác (công thức Haversine theo mét/km) và phương vị hướng đi (Bắc, Đông Bắc, Đông, Nam...).
   - Sinh lộ trình 4 bước âm thanh động theo ngữ cảnh thực tế của điểm đến.
   - Nút "Đọc toàn bộ lộ trình" và nút đọc từng bước bằng giọng nói.
   - Cảnh báo an toàn rõ ràng về sai số GPS đô thị (5–15m) giữa các tòa nhà cao tầng.

3. **Hệ thống SOS khẩn cấp (`app/sos/page.jsx`) (SOS01 - SOS08)**:
   - Đếm ngược 3 giây hủy bỏ thao tác tránh ấn nhầm, có nút kích hoạt ngay lập tức.
   - Tọa độ GPS thời gian thực (kinh độ, vĩ độ, bán kính sai số), kèm đường dẫn Google Maps.
   - 1-chạm gọi trực tiếp các đường dây cứu trợ khẩn cấp: **115 (Y tế)**, **113 (Công an)**, **114 (Cứu nạn)** và **Số người thân (Emergency Contact)**.
   - Mẫu tin nhắn SMS khẩn cấp soạn sẵn link vị trí gửi cho người thân.
   - Danh bạ bệnh viện tiếp nhận cấp cứu tại Hà Nội (Việt Đức, Saint Paul, Bạch Mai).

---

### ƯU TIÊN 6: CẨM NANG, SEO, ACCESSIBILITY & HIỆU NĂNG

1. **Bộ Cẩm nang Du lịch Tiếp cận (`data/articles.js` & `app/cam-nang/`) (CT01 - CT08)**:
   - 4 bài viết dài chuyên sâu:
     1. Kinh nghiệm du lịch Hà Nội cho người khiếm thị – Lịch trình và hướng dẫn tiếp cận.
     2. Cẩm nang du khách khiếm thị sử dụng Chó dẫn đường tại Hà Nội.
     3. Hướng dẫn đi xe buýt, metro và di chuyển tiếp cận tại Hà Nội.
     4. Khám phá ẩm thực Phố cổ Hà Nội qua góc nhìn xúc giác & khứu giác.
   - Cấu trúc H1/H2/H3 ngữ nghĩa, Mục lục TOC tự động cuộn, Trình đọc toàn văn bài viết bằng giọng nói TTS, liên kết chéo tới điểm đến và dịch vụ, Schema.org `Article` JSON-LD.

2. **Tìm kiếm thông minh không dấu (`app/search/page.jsx`) (EX01 - EX03)**:
   - Hàm chuẩn hóa tiếng Việt bóc tách dấu thanh (`normalize()`), tra cứu mượt mà cả "ho guom" và "Hồ Gươm".
   - Tìm kiếm đồng thời trên cả Điểm đến và Dịch vụ.
   - Tìm kiếm bằng giọng nói qua Web Speech API.

3. **SEO Toàn diện & Sơ đồ website (`app/sitemap.js`, `app/robots.js`, `app/destination/page.jsx`) (SEO01 - SEO10)**:
   - **`app/robots.js`**: Cấu hình tệp `robots.txt` chuẩn, cho phép crawler quét các trang công khai, chặn truy cập khu vực riêng tư (`/admin`, `/staff`, `/api`), chỉ định đường dẫn sitemap.
   - **`app/sitemap.js`**: Sinh `sitemap.xml` động bao gồm tất cả các trang tĩnh, toàn bộ điểm đến (`/destination?d=...`), toàn bộ bài viết cẩm nang (`/cam-nang/...`) và dịch vụ catalog.
   - **OpenGraph & Schema.org JSON-LD**: Tích hợp dữ liệu có cấu trúc `TouristDestination` và `Article`.

---

## 2. DANH SÁCH CÁC FILE ĐÃ TẠO MỚI & THAY ĐỔI

### File Tạo Mới:
1. `app/services/page.jsx` — Trang danh mục dịch vụ du lịch tiếp cận toàn diện.
2. `app/services/guide-dog/page.jsx` — Chuyên đề chó dẫn đường theo Luật Người khuyết tật.
3. `app/guide-dog/page.jsx` — Route alias thuận tiện cho chuyên trang chó dẫn đường.
4. `app/cam-nang/page.jsx` — Trang danh sách cẩm nang du lịch tiếp cận.
5. `app/cam-nang/[slug]/page.jsx` — Trang chi tiết bài viết cẩm nang (Server Component & JSON-LD).
6. `app/cam-nang/[slug]/ArticleDetailClient.jsx` — Client Component cẩm nang (TOC, TTS giọng đọc, Lightbox).
7. `app/api/reports/route.js` — API endpoint tiếp nhận và truy vấn báo cáo tiếp cận sai.
8. `app/robots.js` — Cấu hình robots.txt chuẩn SEO của Next.js.
9. `app/sitemap.js` — Cấu hình sitemap.xml động đa đường dẫn của Next.js.
10. `components/HomeGallery.jsx` — Thư viện ảnh tương tác có mô tả xúc giác & giọng đọc cho trang chủ.
11. `components/ImageGalleryModal.jsx` — Modal phóng to ảnh và thuyết minh âm thanh.
12. `components/AdBanner.jsx` — Banner quảng cáo đối tác minh bạch, đạt chuẩn tiếp cận.
13. `data/articles.js` — Cơ sở dữ liệu 4 cẩm nang du lịch tiếp cận chuyên sâu.
14. `tests/features.test.mjs` — Bộ kiểm thử tự động cho catalog, điểm đến, cẩm nang và danh mục.

### File Cập Nhật & Nâng Cấp:
1. `app/globals.css` — Bổ sung biến Dark mode, High contrast, typography và card surfaces.
2. `components/A11yProvider.jsx` — Quản lý theme sáng/tối, cỡ chữ, tương phản và TTS rate.
3. `components/Icons.jsx` — Bổ sung SunIcon, MoonIcon, DogIcon.
4. `components/AccessibilityToolbar.jsx` — Thêm nút chuyển đổi Giao diện sáng/tối.
5. `components/Header.jsx` — Cập nhật menu điều hướng, nút theme và hiển thị tên du khách.
6. `app/page.jsx` — Tinh gọn các section trùng lặp, liên kết điểm đến trực tiếp, tích hợp HomeGallery.
7. `app/profile/page.jsx` — Nâng cấp toàn diện đăng nhập, hồ sơ, tùy chọn trợ năng và liên hệ khẩn cấp.
8. `app/review/page.jsx` — Tích hợp song song Đánh giá 1–5 sao và Báo cáo thông tin sai (RV01, RV02).
9. `app/navigation/page.jsx` — Chọn điểm đến linh hoạt, tính cự ly GPS Haversine và phương vị hướng đi.
10. `app/explore/page.jsx` — Bổ sung tab Tất cả, tab Chó dẫn đường và banner cẩm nang.
11. `app/search/page.jsx` — Tìm kiếm không dấu tiếng Việt, tối ưu useMemo và sửa lỗi entity quotes.
12. `app/my-booking/page.jsx` — Khắc phục hardcode trạng thái, bổ sung tính năng hủy đơn đặt chỗ.
13. `app/destination/page.jsx` & `DestinationView.jsx` — SEO metadata, lưu điểm đến, báo cáo sai và đánh giá.
14. `app/assistant/page.jsx` — Nâng cấp camera AI, kiểm tra độ sáng ảnh, chế độ OCR và lịch sử quét.
15. `app/sos/page.jsx` — Đếm ngược 3s an toàn, tọa độ GPS thời gian thực, quay số 115/113/114.
16. `data/catalog.js` — Thêm item chó dẫn đường, danh mục all/guidedog, tìm kiếm đa dạng id/slug.
17. `lib/api.js` — Bổ sung hàm createReport và listReports gọi backend.

## Rà soát 17/10/2026 — sửa lỗi, nội dung trùng và nội dung chưa xác minh
- SOS: hủy đếm ngược khi rời trang; tách số người thân an toàn; sửa lỗi chính tả; chỉnh mô tả trang chủ cho đúng chức năng.
- Kiểm duyệt: ẩn/hiện đánh giá được lưu (PATCH /api/reviews); hiển thị và xử lý báo cáo sai lệch (PATCH /api/reports); admin có thêm số báo cáo chờ duyệt.
- Đánh giá: bỏ điểm mặc định 5/4, không nhận đánh giá rỗng; trung bình ở trang Business không tính tiêu chí bỏ trống.
- API: làm sạch itemName trong requests/notifications; thêm `reports` vào store mặc định.
- Dữ liệu: hồ sơ Guide demo không còn tên người thật, nhãn xác minh và điểm 4.9; lịch demo tính từ ngày hiện tại; mục Chó dẫn đường demo ghi "Chưa xác minh", dùng ảnh nội bộ.
- Nội dung: trang và cẩm nang Chó dẫn đường, bài di chuyển/ẩm thực bỏ các khẳng định chưa có nguồn; quảng cáo mẫu ghi rõ là minh họa; form đặt chỗ có mục "Đồng hành cùng Chó dẫn đường".
- Trùng lặp: `/services/guide-dog` chuyển hướng về `/guide-dog`; xóa 17 ảnh không dùng (~12MB).
- Hồ sơ: ghi rõ đăng nhập chỉ là demo; không còn gán tên "Minh Đức" cho mọi tài khoản số điện thoại.
