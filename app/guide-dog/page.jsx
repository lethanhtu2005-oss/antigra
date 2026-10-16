import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
import { getDestination } from "@/data/destinations";
import { DogIcon, AccessibleIcon, CheckIcon, PhoneIcon, CalendarIcon, SpeakerIcon } from "@/components/Icons";

export const metadata = {
  title: "Chó dẫn đường – Dịch vụ hỗ trợ du lịch tiếp cận | WayEcho",
  description: "Cẩm nang và dịch vụ hỗ trợ du khách khiếm thị sử dụng chó dẫn đường tại Hà Nội: quy định pháp lý, điểm đến thân thiện, văn hóa ứng xử và cách kết nối.",
  alternates: { canonical: "/guide-dog" },
  openGraph: {
    title: "Chó dẫn đường – Dịch vụ hỗ trợ du lịch tiếp cận | WayEcho",
    description: "Khung pháp lý, địa điểm thân thiện và dịch vụ hỗ trợ người dùng chó dẫn đường tại Hà Nội.",
    url: "/guide-dog",
  },
};

const FRIENDLY_PLACES = [
  {
    name: "Hồ Hoàn Kiếm & Cầu Thê Húc",
    area: "Quận Hoàn Kiếm",
    desc: "Không gian công cộng ngoài trời. Điều kiện lối đi theo từng đoạn chưa được khảo sát; cần kiểm tra thực tế trước khi đi cùng chó dẫn đường.",
    slug: "ho-guom",
  },
  {
    name: "Hồ Tây",
    area: "Quận Tây Hồ",
    desc: "Không gian ven hồ rộng. Chưa có khảo sát đồng nhất cho toàn tuyến; điều kiện vỉa hè thay đổi theo từng đoạn.",
    slug: "ho-tay",
  },
  {
    name: "Văn Miếu – Quốc Tử Giám",
    area: "Quận Đống Đa",
    desc: "Di tích có thu vé và quầy thông tin. Chưa có xác nhận về việc tiếp nhận chó dẫn đường; hãy liên hệ đơn vị quản lý trước khi đến.",
    slug: "van-mieu",
  },
];

export default function GuideDogPage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <Link href="/services" className="hover:underline">Dịch vụ</Link> · <span aria-current="page" className="font-semibold text-ink">Chó dẫn đường</span>
      </nav>

      <div className="mt-4 max-w-3xl">
        <span className="chip hc-surface hc-border bg-primary font-bold">
          <DogIcon size={18} /> Thông tin tham khảo
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Chó dẫn đường tại Hà Nội</h1>
        <p className="hc-muted mt-3 text-lg leading-relaxed text-ink-soft">
          Chó dẫn đường là chó được huấn luyện để hỗ trợ người mù và người nhìn kém di chuyển an toàn và chủ động. Trang này tổng hợp thông tin tham khảo; WayEcho chưa xác minh cơ sở nào tại Hà Nội tiếp nhận chó dẫn đường.
        </p>
      </div>

      {/* Main Image with accessible caption */}
      <figure className="mt-8 aspect-[21/9] max-h-[460px] w-full overflow-hidden rounded-3xl shadow-card bg-surface-alt">
        <VerifiedImage
          src={getDestination("ho-tay").image}
          fallback="/assets/images/location-image-unavailable.svg"
          alt={getDestination("ho-tay").alt}
          priority
          className="h-full w-full object-cover"
        />
        <figcaption className="sr-only">Ảnh Hồ Tây chỉ để minh họa; không khẳng định điều kiện tiếp cận. </figcaption>
      </figure>

      {/* Grid of Key Info */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="role-title">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
            <DogIcon size={26} />
          </span>
          <h2 id="role-title" className="mt-4 text-2xl font-bold">Vai trò của Chó dẫn đường</h2>
          <p className="hc-muted mt-3 text-sm leading-relaxed text-ink-soft">
            Chó dẫn đường được đào tạo để nhận diện mép đường, chỉ dẫn lối lên xuống bậc thang, né tránh chướng ngại vật trên mặt đất và trên cao (như cành cây, mái hiên). Chúng giúp nhiều người khiếm thị di chuyển chủ động hơn; mỗi người chọn công cụ phù hợp với mình, kể cả gậy trắng.
          </p>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="law-title">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
            <CheckIcon size={26} />
          </span>
          <h2 id="law-title" className="mt-4 text-2xl font-bold">Căn cứ pháp lý & Quyền tiếp cận</h2>
          <p className="hc-muted mt-3 text-sm leading-relaxed text-ink-soft">
            <strong>Luật Người khuyết tật Việt Nam (số 51/2010/QH12)</strong> và <strong>Công ước CRPD</strong> bảo đảm quyền tiếp cận bình đẳng các công trình công cộng, giao thông và dịch vụ. Mức độ tiếp nhận chó dẫn đường của từng cơ sở có thể khác nhau; hãy liên hệ trước và mang theo giấy tờ huấn luyện, tiêm chủng. Nội dung này không thay thế tư vấn pháp lý.
          </p>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="etiquette-title">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-900">
            <AccessibleIcon size={26} />
          </span>
          <h2 id="etiquette-title" className="mt-4 text-2xl font-bold">Văn hóa ứng xử cộng đồng</h2>
          <p className="hc-muted mt-3 text-sm leading-relaxed text-ink-soft">
            Khi thấy chó dẫn đường đeo đai công tác: <strong>Tuyệt đối không vuốt ve, không cho đồ ăn, không huýt sáo gọi chó</strong>. Sự xao nhãng dù nhỏ nhất của chú chó cũng có thể đặt người khiếm thị vào tình huống nguy hiểm khi đang qua đường.
          </p>
        </section>
      </div>

      {/* Friendly Places in Hanoi */}
      <section className="mt-14" aria-labelledby="friendly-places-heading">
        <h2 id="friendly-places-heading" className="text-3xl font-bold">Địa điểm tham khảo tại Hà Nội</h2>
        <p className="hc-muted mt-2 text-ink-soft">Danh sách tham khảo, chưa phải cam kết tiếp nhận. Hãy xem dữ liệu tiếp cận của từng nơi:</p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {FRIENDLY_PLACES.map((p) => (
            <article key={p.slug} className="card hc-surface hc-border flex flex-col justify-between border border-line p-5 hover:shadow-card-hover">
              <div>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="hc-muted mt-1 text-xs font-semibold text-accent-dark">{p.area}</p>
                <p className="hc-muted mt-3 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-line hc-border">
                <Link href={`/destination?d=${p.slug}`} className="btn-ghost hc-border !min-h-[40px] !py-2 text-sm w-full text-center">
                  Xem thông tin tiếp cận địa điểm →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How to book assistance */}
      <section className="mt-14 rounded-3xl border border-line bg-surface-alt p-6 shadow-card hc-surface hc-border sm:p-8" aria-labelledby="booking-assistance">
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 id="booking-assistance" className="text-3xl font-bold">Yêu cầu đồng hành & Khách sạn tiếp nhận</h2>
            <p className="hc-muted mt-3 text-base leading-relaxed text-ink-soft">
              Khi đặt phòng khách sạn hoặc đặt tour có hướng dẫn viên qua WayEcho, bạn hãy tích chọn mục <strong>“Đồng hành cùng Chó dẫn đường”</strong> trong Accessibility Request. Yêu cầu sẽ được gửi tới doanh nghiệp để họ xác nhận hoặc từ chối. Trong bản demo, chưa có cơ sở thật nào xử lý yêu cầu này.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/booking?item=demo-hotel" className="btn-primary text-base">
                <CalendarIcon size={20} /> Tạo yêu cầu đặt chỗ demo
              </Link>
              <Link href="/cam-nang/cho-dan-duong-ha-noi" className="btn-ghost hc-border text-base">
                Đọc cẩm nang chi tiết
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 hc-surface hc-border">
            <h3 className="font-bold text-lg">Cần hỗ trợ tư vấn?</h3>
            <p className="mt-2 text-sm text-ink-soft hc-muted leading-relaxed">
              Bản demo chưa có đường dây tư vấn thật về kiểm dịch, thức ăn thú y hay đón sân bay. Bạn có thể xem mục hỗ trợ và SOS demo:
            </p>
            <Link href="/help#contact" className="btn-dark mt-4 w-full !min-h-[42px] !py-2 text-sm">
              <PhoneIcon size={18} /> Xem mục hỗ trợ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
