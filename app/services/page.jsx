import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
import {
  BedIcon, BusIcon, MuseumIcon, UserIcon, DogIcon, AccessibleIcon, CalendarIcon, SpeakerIcon, CheckIcon,
} from "@/components/Icons";
import AdBanner, { SAMPLE_ADS } from "@/components/AdBanner";

export const metadata = {
  title: "Dịch vụ du lịch tiếp cận tại Hà Nội – WayEcho",
  description: "Danh mục dịch vụ du lịch chuyên biệt cho người khiếm thị: lưu trú tiếp cận, phương tiện, vé tham quan, hướng dẫn viên và hỗ trợ chó dẫn đường.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Dịch vụ du lịch tiếp cận tại Hà Nội | WayEcho",
    description: "Lưu trú, phương tiện, vé di tích, hướng dẫn viên và hỗ trợ chó dẫn đường cho người mù và người nhìn kém.",
    url: "/services",
  },
};

const SERVICES = [
  {
    id: "accommodation",
    title: "1. Lưu trú tiếp cận",
    icon: BedIcon,
    tag: "Lưu trú",
    desc: "Các cơ sở lưu trú được khảo sát theo các tiêu chí: lối vào không bậc (step-free), cửa phòng rộng, công tắc đèn và ổ điện độ cao phù hợp, nhân viên được tập huấn tiếp đón người khiếm thị và tiếp nhận chó dẫn đường.",
    items: [
      {
        name: "Phòng lưu trú tiếp cận mẫu",
        area: "Quận Hoàn Kiếm, Hà Nội",
        price: "Giá theo thời điểm",
        features: ["Lối vào không bậc", "Hỗ trợ check-in tại phòng", "Thân thiện với chó dẫn đường", "Dịch vụ phòng 24/7"],
        bookingId: "demo-hotel",
      },
    ],
  },
  {
    id: "transport",
    title: "2. Phương tiện & di chuyển",
    icon: BusIcon,
    tag: "Phương tiện",
    desc: "Lựa chọn phương tiện thuận tiện cho người khiếm thị: xe điện du lịch tham quan phố cổ, xe hỗ trợ đón trả tận sảnh và hướng dẫn lộ trình xe buýt sàn thấp có loa đọc tên trạm.",
    items: [
      {
        name: "Xe điện du lịch tham quan Phố cổ",
        area: "Khu vực Hoàn Kiếm, Hà Nội",
        price: "Theo lộ trình tour",
        features: ["Thuyết minh loa tự động", "Tốc độ chậm an toàn", "Trợ lý hỗ trợ lên/xuống xe", "Đón tại Hồ Gươm"],
        bookingId: "demo-transport",
      },
    ],
  },
  {
    id: "ticket",
    title: "3. Vé tham quan & Di tích",
    icon: MuseumIcon,
    tag: "Vé & Di tích",
    desc: "Vé tham quan các di tích văn hóa hàng đầu tại Hà Nội. Hỗ trợ áp dụng chính sách miễn, giảm giá vé theo Nghị định số 28/2012/NĐ-CP của Chính phủ dành cho người khuyết tật nặng và đặc biệt nặng.",
    items: [
      {
        name: "Vé Di tích Văn Miếu – Quốc Tử Giám",
        area: "58 Quốc Tử Giám, Đống Đa",
        price: "70.000đ (miễn/giảm theo quy định khi xuất trình giấy tờ)",
        features: ["Kèm thiết bị Audio Guide", "Mã QR thông tin tiếp cận", "Quầy trợ giúp du khách"],
        bookingId: "ve-van-mieu",
      },
      {
        name: "Vé Nhà hát Múa rối Thăng Long",
        area: "57B Đinh Tiên Hoàng, Hoàn Kiếm",
        price: "100.000đ – 200.000đ tùy hạng vé",
        features: ["Âm nhạc dân gian sống động", "Vị trí ngồi thuận tiện di chuyển", "Gần Hồ Hoàn Kiếm"],
        bookingId: "ve-mua-roi",
      },
    ],
  },
  {
    id: "guide",
    title: "4. Hướng dẫn viên & Trợ lý đồng hành",
    icon: UserIcon,
    tag: "Con người",
    desc: "Đội ngũ Guide và Personal Assistant am hiểu địa phương, được đào tạo kỹ năng định hướng di chuyển (Orientation & Mobility) và kỹ năng mô tả hình ảnh bằng lời nói sinh động cho người khiếm thị.",
    items: [
      {
        name: "Trợ lý đồng hành cá nhân (Personal Assistant)",
        area: "Toàn thành phố Hà Nội",
        price: "Theo lịch hỗ trợ",
        features: ["Đồng hành suốt tuyến", "Mô tả cảnh quan & đọc tài liệu", "Hỗ trợ bữa ăn và chọn món", "Bảo mật thông tin cá nhân"],
        bookingId: "demo-guide-tour",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <span aria-current="page" className="font-semibold text-ink">Dịch vụ</span>
      </nav>

      <div className="mt-4 max-w-3xl">
        <span className="chip hc-surface hc-border bg-primary">
          <AccessibleIcon size={16} /> Dịch vụ du lịch tiếp cận
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Dịch vụ hỗ trợ du lịch Hà Nội</h1>
        <p className="hc-muted mt-3 text-lg leading-relaxed text-ink-soft">
          WayEcho phân loại rõ ràng các nhóm dịch vụ giúp người mù và người nhìn kém có thể chủ động lập kế hoạch, đặt chỗ và gửi kèm nhu cầu hỗ trợ cụ thể (Accessibility Request) một cách minh bạch.
        </p>
      </div>

      {/* Guide Dog Feature Banner */}
      <section className="mt-8 overflow-hidden rounded-3xl border-2 border-primary bg-gradient-to-r from-[#fff5e5] to-[#fffdf9] p-6 shadow-card hc-surface hc-border sm:p-8" aria-labelledby="dog-service-title">
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3.5 py-1 text-sm font-bold text-amber-900">
              <DogIcon size={18} /> Dịch vụ chuyên biệt mới
            </span>
            <h2 id="dog-service-title" className="mt-3 text-3xl font-bold">Dịch vụ đồng hành cùng Chó dẫn đường</h2>
            <p className="mt-2 text-base leading-relaxed text-ink-soft hc-muted">
              Tìm hiểu quy định pháp lý, cách kết nối cơ sở lưu trú và điểm tham quan tiếp nhận chó dẫn đường tại Hà Nội, cùng hướng dẫn văn hóa ứng xử cộng đồng.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/guide-dog" className="btn-primary text-base">
                <DogIcon size={20} /> Xem chi tiết cẩm nang Chó dẫn đường →
              </Link>
              <Link href="/booking?item=demo-hotel" className="btn-ghost hc-border text-base">
                Đặt dịch vụ thân thiện với chó
              </Link>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-card">
            <VerifiedImage
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/West_Lake_Hanoi.jpg/1280px-West_Lake_Hanoi.jpg"
              fallback="/assets/images/location-image-unavailable.svg"
              alt="Hồ Tây Hà Nội với không gian ven hồ thoáng đãng, điểm đến thích hợp cho người đi dạo cùng chó dẫn đường."
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Service Categories */}
      <div className="mt-12 space-y-12">
        {SERVICES.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.id} id={cat.id} aria-labelledby={`title-${cat.id}`} className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-ink">
                  <Icon size={24} />
                </span>
                <div>
                  <h2 id={`title-${cat.id}`} className="text-3xl font-bold">{cat.title}</h2>
                  <span className="text-xs font-semibold text-accent-dark uppercase tracking-wider">{cat.tag}</span>
                </div>
              </div>
              <p className="hc-muted mt-3 max-w-3xl text-ink-soft leading-relaxed">{cat.desc}</p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {cat.items.map((it) => (
                  <article key={it.name} className="card hc-surface hc-border flex flex-col justify-between border border-line p-6 hover:shadow-card-hover">
                    <div>
                      <h3 className="text-xl font-bold">{it.name}</h3>
                      <p className="hc-muted mt-1 text-sm text-ink-soft">{it.area}</p>
                      <p className="mt-3 font-semibold text-accent-dark">{it.price}</p>
                      <ul className="mt-4 space-y-1.5 text-sm text-ink-soft hc-muted">
                        {it.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-line hc-border">
                      <Link href={`/booking?item=${it.bookingId}`} className="btn-primary !min-h-[42px] !py-2 text-sm flex-1 text-center">
                        <CalendarIcon size={18} /> Đặt dịch vụ này
                      </Link>
                      <Link href={`/item?id=${it.bookingId}`} className="btn-ghost hc-border !min-h-[42px] !py-2 text-sm">
                        Chi tiết
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Ad Showcase */}
      <div className="mt-14">
        <AdBanner ad={SAMPLE_ADS[0]} />
      </div>

      {/* Trust & Transparency Note */}
      <div className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 hc-border" role="note">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <AccessibleIcon size={20} /> Nguyên tắc minh bạch dữ liệu dịch vụ WayEcho
        </h3>
        <p className="mt-2 text-sm leading-relaxed">
          WayEcho không tự ý tạo giá giả hoặc cam kết vé còn chỗ/phòng trống nếu chưa được đối tác hoặc cơ sở quản lý chính thức xác nhận. Các mục có nhãn <strong>DEMO</strong> giúp người dùng làm quen với quy trình gửi yêu cầu hỗ trợ (Accessibility Request) trước khi triển khai hệ thống thanh toán và tích hợp kho vé thật.
        </p>
      </div>
    </div>
  );
}
