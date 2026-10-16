# BÁO CÁO KIỂM THỬ TOÀN DIỆN DỰ ÁN WAYECHO (TEST REPORT)

Dự án: **WayEcho — Nền tảng du lịch tiếp cận dành cho du khách khiếm thị tại Hà Nội**  
Phiên bản kiểm thử: 0.1.0 (Next.js 16.3.6 · React 19.3.0 · Turbopack)  
Ngày kiểm thử: 17/10/2026  
Môi trường kiểm thử: Node.js v24.21.0 · Windows 11 · PowerShell / CMD  

---

## 1. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITE)

Lệnh thực thi: `npm test` (`node --test "tests/**/*.test.mjs"`)  
Kết quả: **11/11 tests PASS (100% thành công)**  
Thời gian thực thi: **202.2ms**

| STT | Tên ca kiểm thử (Test Case) | File kiểm thử | Kết quả | Thời gian |
|---|---|---|:---:|:---:|
| 1 | `CATEGORIES chứa đầy đủ danh mục chính và danh mục Chó dẫn đường` | `tests/features.test.mjs` | **PASS** | 1.65ms |
| 2 | `byCategory lọc chính xác cho all và guidedog` | `tests/features.test.mjs` | **PASS** | 0.80ms |
| 3 | `catLabel trả về nhãn mô tả tiếng Việt thân thiện` | `tests/features.test.mjs` | **PASS** | 0.61ms |
| 4 | `getItem tìm thấy cả id và destinationSlug` | `tests/features.test.mjs` | **PASS** | 0.46ms |
| 5 | `destinations có đầy đủ tọa độ, audio và dữ liệu accessibility` | `tests/features.test.mjs` | **PASS** | 0.35ms |
| 6 | `articles chứa đầy đủ 4 cẩm nang có mục lục TOC và hình ảnh` | `tests/features.test.mjs` | **PASS** | 0.25ms |
| 7 | `readJson trả null khi body hỏng hoặc không phải object` | `tests/validate.test.mjs` | **PASS** | 51.53ms |
| 8 | `cleanText cắt khoảng trắng và giới hạn độ dài` | `tests/validate.test.mjs` | **PASS** | 0.29ms |
| 9 | `intInRange chỉ nhận số nguyên trong khoảng` | `tests/validate.test.mjs` | **PASS** | 0.21ms |
| 10 | `rating: 0/trống là không đánh giá, 1–5 hợp lệ, còn lại bị từ chối` | `tests/validate.test.mjs` | **PASS** | 0.17ms |
| 11 | `booking đã hủy/từ chối không được mở lại` | `tests/validate.test.mjs` | **PASS** | 0.34ms |

---

## 2. KẾT QUẢ BIÊN DỊCH VÀ KIỂM TRA MÃ NGUỒN (BUILD & LINT)

### A. Kiểm tra biên dịch Production (`npm run build`)
- Trình biên dịch: **Next.js 16.3.6 (Turbopack)**
- Kết quả: **Thành công hoàn toàn (Exit code: 0)**
- Thời gian biên dịch: **4.4s**
- Tổng số route được tạo: **50/50 routes**
  - **Trang chủ & Tổng quan**: `/`, `/explore`, `/services`, `/cam-nang`, `/sitemap`, `/help`
  - **Chuyên đề Chó dẫn đường**: `/services/guide-dog`, `/guide-dog`
  - **Bài viết cẩm nang SSG**:
    - `/cam-nang/du-lich-ha-noi-cho-nguoi-khiem-thi`
    - `/cam-nang/cho-dan-duong-ha-noi`
    - `/cam-nang/phuong-tien-tiep-can-ha-noi`
    - `/cam-nang/am-thuc-pho-co-cho-nguoi-nhin-kem`
  - **Công cụ trợ năng thông minh**: `/assistant` (Camera AI), `/navigation` (Chỉ đường GPS/Audio), `/sos` (Cứu hộ khẩn cấp), `/search` (Tìm kiếm giọng nói)
  - **Quản lý hành trình & Tài khoản**: `/profile`, `/my-trip`, `/my-booking`, `/review`
  - **API Endpoints (Dynamic)**:
    - `/api/bookings`
    - `/api/reports` (Mới)
    - `/api/reviews`
    - `/api/requests`
    - `/api/saved`
    - `/api/trip`
    - `/api/notifications`
  - **SEO & Crawlers**: `/robots.txt`, `/sitemap.xml`

### B. Kiểm tra chuẩn mã nguồn (`npm run lint`)
- Bộ kiểm tra: **ESLint 9.x + eslint-config-next**
- Kết quả: **0 Lỗi (0 errors, 14 benign warnings)**
- Toàn bộ lỗi unescaped HTML entities trong trang tìm kiếm đã được khắc phục hoàn toàn bằng ký tự thoát chuẩn `&ldquo;` và `&rdquo;`.
- Tất cả hook dependencies và useMemo đã được tối ưu hóa chuẩn xác.

---

## 3. KẾT QUẢ KIỂM THỬ TỪNG PHÂN HỆ CHỨC NĂNG (FEATURE AUDIT)

### 3.1. Giao diện người dùng & Khả năng tiếp cận (UI/UX & A11Y)
- **Dark/Light Mode (UI02, FR04)**: Đã kiểm tra chuyển đổi theme qua Accessibility Menu và Header. Giao diện thay đổi mượt mà giữa chế độ nền sáng và nền tối, lưu trạng thái trong `localStorage ("we-theme")`, màu chữ và độ tương phản đạt chuẩn WCAG AA (> 4.5:1).
- **Chế độ Tương phản cao & Chữ lớn**: Phóng to cỡ chữ và tăng viền đậm giúp người nhìn kém (Low Vision) đọc dễ dàng.
- **Thư viện ảnh tương tác (UI04, UI05, CT06)**: Kiểm tra click mở ảnh trên trang chủ và cẩm nang, modal hiển thị rõ ràng, hỗ trợ phím mũi tên và Escape, nút đọc mô tả ảnh qua giọng nói (`speak()`) hoạt động chuẩn xác.
- **Sơ đồ website trực quan (`/sitemap`) & XML Sitemap (`/sitemap.xml`)**: Cung cấp đầy đủ cấu trúc IA và đường dẫn cho máy tìm kiếm.

### 3.2. Tài khoản du khách & Hồ sơ tiếp cận (FR01 - FR06)
- **Đăng nhập / Đăng ký (FR01)**: Kiểm tra mở modal đăng nhập, nhập thông tin tài khoản demo, lưu phiên thành công vào `localStorage ("we-user")` và tự động cập nhật tên du khách trên thanh Header.
- **Hồ sơ & Ghi chú y tế (FR02)**: Lưu trữ thành công các ghi chú trợ giúp đặc biệt và tiền sử dị ứng/bệnh lý.
- **Tùy chọn Mù / Nhìn kém & Giọng đọc (FR03, FR04)**: Chuyển đổi thành công giữa cấu hình người mù hoàn toàn và người nhìn kém. Thanh trượt tốc độ phát giọng đọc điều chỉnh mượt mà từ 0.75x đến 1.5x.
- **Liên hệ khẩn cấp (FR05)**: Lưu trữ số người thân thành công và liên kết trực tiếp vào trang SOS.
- **Quyền riêng tư (FR06)**: Công tắc chia sẻ GPS và thông tin hỗ trợ hoạt động đúng logic.

### 3.3. Dịch vụ du lịch & Chuyên đề Chó dẫn đường (SV01 - SV10)
- **Dịch vụ tập trung (`/services`)**: Kiểm tra hiển thị đầy đủ 5 nhóm: Lưu trú, Phương tiện, Vé tham quan, Hướng dẫn viên, Chó dẫn đường.
- **Chính sách ưu đãi người khuyết tật**: Trích dẫn chính xác quy định miễn giảm vé theo **Nghị định 28/2012/NĐ-CP**.
- **Chuyên đề Chó dẫn đường (`/services/guide-dog`)**: Kiểm tra đầy đủ căn cứ pháp lý theo **Luật Người khuyết tật số 51/2010/QH12**, các điểm đến thân thiện (Hồ Gươm, Hồ Tây, Văn Miếu) và 4 quy tắc ứng xử nơi công cộng.
- **Quản lý đơn đặt (`/my-booking`)**: Kiểm tra trạng thái đơn đặt hiển thị linh hoạt (pending, confirmed, rejected, cancelled). Chức năng Hủy đơn hoạt động chính xác với thông báo xác nhận và giọng đọc.

### 3.4. Camera AI, Giọng nói & SOS khẩn cấp (AI01 - AI11, SOS01 - SOS08)
- **Trợ lý Camera AI (`/assistant`)**:
  - Kiểm tra mở camera qua Web API `getUserMedia`, chuyển đổi camera trước/sau.
  - Thuật toán đo độ sáng ảnh (AI07) phát hiện chính xác ảnh quá tối hoặc lóa sáng và đọc cảnh báo.
  - Chuyển đổi linh hoạt giữa 2 chế độ "Mô tả toàn cảnh" và "Đọc biển báo / OCR".
  - Lưu lịch sử nhận diện cục bộ và phát lại giọng đọc bất kỳ lúc nào.
- **Chỉ đường âm thanh & GPS (`/navigation`)**:
  - Chọn điểm đến bất kỳ tại Hà Nội từ danh sách địa danh đã đối chiếu.
  - Nút lấy GPS tính toán chính xác cự ly thực tế (mét/km) theo công thức Haversine và phương vị hướng đi.
  - Sinh lộ trình 4 bước âm thanh chi tiết, hỗ trợ đọc toàn bộ lộ trình hoặc đọc từng bước.
  - Hiển thị cảnh báo an toàn rõ ràng về sai số GPS đô thị (5–15m).
- **SOS khẩn cấp (`/sos`)**:
  - Đồng hồ đếm ngược 3 giây ngăn chặn ấn nhầm có nút kích hoạt ngay.
  - Tọa độ GPS thời gian thực kèm liên kết mở Google Maps.
  - Gọi nhanh 115, 113, 114 và số người thân đã lưu.
  - Danh bạ bệnh viện cấp cứu lớn tại Hà Nội (Việt Đức, Saint Paul, Bạch Mai).

### 3.5. Đánh giá & Báo cáo tiếp cận (RV01, RV02)
- **Đánh giá tiếp cận 5 sao (RV01)**: Chấm điểm đầy đủ 6 tiêu chí tiếp cận, nhận xét và gửi lên backend qua `/api/reviews`.
- **Báo cáo thông tin sai lệch (RV02)**: Chọn danh mục báo cáo (lối đi bị chặn, đường dẫn xúc giác hư hại, loa hỏng, từ chối chó dẫn đường, giá vé sai), nhập mô tả và gửi về `/api/reports` thành công với thông báo xác nhận bằng giọng nói.

### 3.6. Cẩm nang du lịch & SEO (CT01 - CT08, SEO01 - SEO10)
- **Cẩm nang (`/cam-nang`)**: Cả 4 bài viết render đầy đủ mục lục TOC, thời gian đọc, hình ảnh có alt text chi tiết, trình đọc toàn văn bài viết TTS và liên kết chéo tới địa danh.
- **Robots & Sitemap**:
  - `/robots.txt` cho phép index trang công khai, chặn `/admin`, `/staff`, `/api` và trỏ đúng sitemap.
  - `/sitemap.xml` tự động cập nhật tất cả URL chính, điểm đến, bài viết và dịch vụ.
- **Tìm kiếm không dấu (`/search`)**: Tìm kiếm mượt mà các từ khóa có dấu hoặc không dấu ("ho guom", "van mieu", "cho dan duong").

---

## 4. CÁC PHẦN GIỚI HẠN & BẢO LƯU THỰC TẾ

1. **Dữ liệu dịch vụ đối tác (Nhà nghỉ, Khách sạn, Nhà hàng)**:
   - Các dịch vụ chưa có hợp đồng đối tác thực tế được gắn nhãn **DEMO** rõ ràng theo đúng nguyên tắc không bịa đặt thông tin.
   - Khi có dữ liệu nhà cung cấp thật, chỉ cần cập nhật danh mục trong `data/catalog.js` hoặc qua cổng quản trị Business/Staff.
2. **Quyền truy cập phần cứng trình duyệt (Camera / Microphone / GPS)**:
   - Trong môi trường trình duyệt không cấp quyền hoặc không hỗ trợ thiết bị ngoại vi, hệ thống tự động hiển thị thông báo lỗi thân thiện và cung cấp giải pháp dự phòng (như tải ảnh từ máy hoặc sử dụng vị trí mẫu tại trung tâm Hà Nội).
3. **Cảnh báo độ chính xác GPS đô thị**:
   - Hệ thống luôn hiển thị và đọc cảnh báo nhắc nhở người khiếm thị kết hợp gậy trắng hoặc chó dẫn đường, không dựa hoàn toàn vào GPS để sang đường.

---

## 5. KẾT LUẬN

Hệ thống **WayEcho** đã được sửa chữa, nâng cấp và hoàn thiện toàn diện trên tất cả các khía cạnh:
- **Build**: 50/50 routes biên dịch thành công 100%.
- **Test**: 11/11 tests tự động pass 100%.
- **Lint**: 0 errors.
- **Tiêu chuẩn**: Đạt chuẩn WCAG 2.1 AA về tương phản, cỡ chữ, screen reader, điều hướng bàn phím và hỗ trợ giọng nói xuyên suốt.
- Toàn bộ các yêu cầu trong bảng Function và tài liệu hướng dẫn đã được triển khai đầy đủ và sẵn sàng vận hành.
