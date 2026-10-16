import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
import HomeGallery from "@/components/HomeGallery";
import {
  AccessibleIcon,
  BedIcon,
  BookmarkIcon,
  BusIcon,
  CameraIcon,
  CompassIcon,
  DogIcon,
  FoodIcon,
  HeadphonesIcon,
  MapPinIcon,
  MicIcon,
  MuseumIcon,
  SearchIcon,
  SpeakerIcon,
  UserIcon,
} from "@/components/Icons";

const FALLBACK = "/assets/images/location-image-unavailable.svg";

const HOME_IMAGES = {
  hoGuom: {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Huc_Bridge.jpg",
    alt: "Cầu Thê Húc màu đỏ bắc qua Hồ Hoàn Kiếm, nối bờ hồ với khu đền Ngọc Sơn; cây xanh phủ quanh mặt hồ.",
  },
  oldQuarter: {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/31/Vietnam_hanoi_old_quarter.jpg",
    alt: "Một tuyến phố thuộc khu Phố cổ Hà Nội với cửa hàng hai bên, xe máy, người đi bộ và người bán hàng trên phố.",
  },
  pho: {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Ph%E1%BB%9F_b%C3%A1t_%C4%91%C3%A1.jpg",
    alt: "Một suất phở bát đá chụp tại Hà Nội, gồm nước dùng nóng, bánh phở, thịt bò, rau và gia vị ăn kèm.",
  },
  trainStreet: {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Hanoi_train_street.jpg",
    alt: "Phố đường tàu Hà Nội với đường ray chạy giữa khu dân cư, cây xanh, quán nhỏ và cờ Việt Nam treo bên lối đi.",
  },
  vanMieu: {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg",
    alt: "Khuôn viên Văn Miếu – Quốc Tử Giám tại Hà Nội với cổng kiến trúc truyền thống, mái ngói và cây xanh.",
  },
  westLake: {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/09/West_Lake_Hanoi.jpg",
    alt: "Mặt nước Hồ Tây nhìn từ khu vực Phủ Tây Hồ, phía xa là dải đô thị Hà Nội dưới bầu trời sáng.",
  },
  navigation: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/43/Smartphone_with_navigation_map_app.jpg",
    alt: "Một bàn tay cầm điện thoại thông minh đang mở ứng dụng bản đồ điều hướng; ảnh minh họa cho chức năng chỉ đường.",
  },
  camera: {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/16/A_man_using_a_cell_phone_to_take_a_photo.jpg",
    alt: "Một người đang dùng điện thoại để chụp ảnh; ảnh minh họa cho chức năng trợ lý camera của WayEcho.",
  },
  humanSupport: {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/dc/O%26M_instructor.jpg",
    alt: "Một buổi hướng dẫn định hướng và di chuyển, trong đó người hướng dẫn đứng cạnh người đang thực hành sử dụng gậy trắng; ảnh minh họa cho hỗ trợ con người.",
  },
};

const needCards = [
  { icon: AccessibleIcon, label: "Điểm đến\ndễ tiếp cận", href: "/explore?cat=destination", tone: "bg-[#41b866]" },
  { icon: BedIcon, label: "Lưu trú\nthân thiện", href: "/services#accommodation", tone: "bg-[#4d83cc]" },
  { icon: BusIcon, label: "Di chuyển\nthuận tiện", href: "/services#transport", tone: "bg-[#f56f41]" },
  { icon: DogIcon, label: "Chó\ndẫn đường", href: "/guide-dog", tone: "bg-[#10b981]" },
  { icon: MuseumIcon, label: "Vé tham quan\n& Hoạt động", href: "/services#tickets", tone: "bg-[#8d62d8]" },
  { icon: UserIcon, label: "Guide &\nAssistant", href: "/services#guides", tone: "bg-[#eea22e]" },
];

const destinationCards = [
  {
    title: "Hồ Gươm & Cầu Thê Húc",
    area: "Quận Hoàn Kiếm",
    image: HOME_IMAGES.hoGuom,
    facts: ["Lối đi ven hồ", "Nhiều ghế nghỉ"],
    badge: "Dễ tiếp cận",
    badgeClass: "bg-[#dff5e5] text-[#16733b]",
    href: "/destination?d=ho-guom",
  },
  {
    title: "Văn Miếu – Quốc Tử Giám",
    area: "Quận Đống Đa",
    image: HOME_IMAGES.vanMieu,
    facts: ["Khuôn viên yên tĩnh", "Có thuyết minh"],
    badge: "Tiếp cận một phần",
    badgeClass: "bg-[#fff0cf] text-[#a76500]",
    href: "/destination?d=van-mieu",
  },
  {
    title: "Phố cổ Hà Nội",
    area: "Quận Hoàn Kiếm",
    image: HOME_IMAGES.oldQuarter,
    facts: ["Nhiều âm thanh", "Cần hỗ trợ định hướng"],
    badge: "Cần hỗ trợ",
    badgeClass: "bg-[#ffe0dc] text-[#a33a2f]",
    href: "/destination?d=pho-co",
  },
  {
    title: "Hồ Tây & làng ven hồ",
    area: "Quận Tây Hồ",
    image: HOME_IMAGES.westLake,
    facts: ["Không gian thoáng", "Phù hợp dạo nhẹ"],
    badge: "Dễ tiếp cận",
    badgeClass: "bg-[#dff5e5] text-[#16733b]",
    href: "/destination?d=ho-tay",
  },
];

const coreAssistants = [
  {
    icon: MicIcon,
    title: "Tìm kiếm bằng giọng nói",
    desc: "Chỉ cần nói tên địa điểm hoặc nhu cầu, WayEcho sẽ tìm điểm đến, vé tham quan và dịch vụ phù hợp.",
    href: "/search",
    action: "Tìm bằng giọng nói",
    tone: "bg-[#ff6b2c]",
  },
  {
    icon: CameraIcon,
    title: "Trợ lý Camera AI",
    desc: "Đọc biển báo, bảng chỉ dẫn, thực đơn quán ăn và mô tả toàn cảnh hỗ trợ du khách khiếm thị theo thời gian thực.",
    href: "/assistant",
    action: "Mở trợ lý camera",
    tone: "bg-[#397ecb]",
  },
  {
    icon: CompassIcon,
    title: "Chỉ đường & Âm thanh",
    desc: "Bản đồ tiếp cận có âm thanh, định hướng từng bước và cảnh báo địa hình, bậc thang và giao cắt.",
    href: "/navigation",
    action: "Xem bản đồ tiếp cận",
    tone: "bg-[#35a356]",
  },
  {
    icon: DogIcon,
    title: "Chó dẫn đường & Guide",
    desc: "Hướng dẫn pháp lý và kết nối điểm đến thân thiện với chó dẫn đường, cùng đội ngũ hướng dẫn viên hỗ trợ chuyên biệt.",
    href: "/guide-dog",
    action: "Khám phá dịch vụ",
    tone: "bg-[#8a5bd2]",
  },
];

const processSteps = [
  { n: "1", icon: SearchIcon, title: "1. Khám phá điểm đến", desc: "Tìm kiếm bằng giọng nói hoặc bộ lọc tiếp cận thông minh các địa danh nổi bật tại Hà Nội." },
  { n: "2", icon: AccessibleIcon, title: "2. Kiểm tra tiếp cận", desc: "Nắm rõ tiêu chí lối vào, bậc dốc, thuyết minh âm thanh và khả năng tiếp nhận chó dẫn đường." },
  { n: "3", icon: MuseumIcon, title: "3. Đặt dịch vụ & Hỗ trợ", desc: "Đặt phòng lưu trú thân thiện, vé tham quan giảm giá theo Nghị định 28 và yêu cầu Guide đồng hành." },
  { n: "4", icon: MapPinIcon, title: "4. Tự tin trải nghiệm", desc: "Tự do dạo phố, lắng nghe âm thanh thủ đô cùng trợ lý camera AI và nút SOS an toàn khẩn cấp." },
];

const stories = [
  {
    initial: "M",
    quote: "“Nhờ WayEcho, mình có thể tự tìm đường đến Hồ Gươm và nghe thuyết minh bằng giọng nói. Cảm giác thật sự tự do và chủ động hơn rất nhiều!”",
    name: "Minh Đức",
    role: "Du khách khiếm thị",
  },
  {
    initial: "T",
    quote: "“Tôi nhìn kém nên thường lo lắng khi đi chỗ lạ. WayEcho giúp tôi kiểm tra trước mức độ tiếp cận và bật chế độ tương phản cao, chữ lớn để đọc rất dễ chịu.”",
    name: "Thu Hà",
    role: "Du khách nhìn kém",
  },
  {
    initial: "H",
    quote: "“Là thành viên cộng đồng đồng hành cùng người khiếm thị, tôi rất vui khi thấy WayEcho tạo ra cầu nối nhân văn và chuyên nghiệp đến vậy.”",
    name: "Anh Hùng",
    role: "Hướng dẫn viên tình nguyện",
  },
];

function RoundIcon({ children, className = "" }) {
  return <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${className}`}>{children}</span>;
}

export default function HomePage() {
  return (
    <div className="home-page hc-surface">
      {/* Hero Section */}
      <section className="container-page pb-8 pt-8 lg:pb-10 lg:pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-12">
          <div>
            <span className="chip hc-surface hc-border"><AccessibleIcon size={16} /> Thiết kế chuyên biệt cho người khiếm thị</span>
            <h1 className="mt-5 max-w-[650px] text-5xl leading-[.98] sm:text-6xl lg:text-[68px]">
              Du lịch Hà Nội,<br />dẫn lối <span className="text-[#eb5d27]">bằng giọng nói</span>
            </h1>
            <p className="hc-muted mt-5 max-w-[650px] text-[18px] leading-8 text-ink-soft">
              WayEcho là nền tảng du lịch tiếp cận đầu tiên tại Hà Nội dành cho người khiếm thị và người sử dụng chó dẫn đường. Tìm kiếm bằng giọng nói, kiểm tra khả năng tiếp cận thực tế, đặt dịch vụ và đồng hành an toàn cùng trợ lý AI.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary text-base sm:text-lg"><MicIcon size={22} /> Bắt đầu bằng giọng nói</Link>
              <Link href="/assistant" className="btn-ghost hc-border text-base sm:text-lg"><CameraIcon size={22} /> Mở trợ lý camera AI</Link>
            </div>
            <p className="hc-muted mt-5 flex items-center gap-3 text-sm italic text-ink-soft"><span aria-hidden="true" className="inline-block h-[4px] w-10 rounded-full bg-primary" /> Hà Nội gần hơn, cho mọi người</p>
          </div>

          <div className="grid min-h-[430px] grid-cols-2 grid-rows-2 gap-3" aria-label="Một số hình ảnh về Hà Nội có mô tả tiếp cận">
            <Link href="/destination?d=ho-guom" className="group relative row-span-1 overflow-hidden rounded-[24px] shadow-card lg:row-span-2">
              <VerifiedImage src={HOME_IMAGES.hoGuom.src} fallback={FALLBACK} alt={HOME_IMAGES.hoGuom.alt} priority className="h-full min-h-[250px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/60 px-4 py-3 text-white backdrop-blur-sm"><span className="flex items-center gap-2 font-bold"><MapPinIcon size={18} /> Hồ Gươm</span><span className="block pl-6 text-xs text-white/85">Biểu tượng của thủ đô Hà Nội</span></span>
            </Link>
            <Link href="/destination?d=pho-co" className="group relative overflow-hidden rounded-[24px] shadow-card">
              <VerifiedImage src={HOME_IMAGES.oldQuarter.src} fallback={FALLBACK} alt={HOME_IMAGES.oldQuarter.alt} className="h-full min-h-[205px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/60 px-3 py-2.5 text-white backdrop-blur-sm"><span className="flex items-center gap-2 font-bold"><MapPinIcon size={17} /> Phố cổ Hà Nội</span><span className="block pl-6 text-[11px] text-white/85">Nét xưa giữa lòng thành phố</span></span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/explore?cat=restaurant" className="group relative overflow-hidden rounded-[22px] shadow-card">
                <VerifiedImage src={HOME_IMAGES.pho.src} fallback={FALLBACK} alt={HOME_IMAGES.pho.alt} className="h-full min-h-[205px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                <span className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2.5 py-2 text-white backdrop-blur-sm"><span className="font-bold">Ẩm thực Hà Nội</span><span className="block text-[10px] text-white/85">Hương vị đậm đà</span></span>
              </Link>
              <Link href="/explore?cat=activity" className="group relative overflow-hidden rounded-[22px] shadow-card">
                <VerifiedImage src={HOME_IMAGES.trainStreet.src} fallback={FALLBACK} alt={HOME_IMAGES.trainStreet.alt} className="h-full min-h-[205px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                <span className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2.5 py-2 text-white backdrop-blur-sm"><span className="font-bold">Đường tàu Hà Nội</span><span className="block text-[10px] text-white/85">Trải nghiệm độc đáo</span></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Voice & Quick Action Bar */}
      <section className="container-page pb-7">
        <div className="rounded-[22px] border border-line bg-white p-5 shadow-card hc-surface hc-border sm:p-7">
          <h2 className="text-3xl">Bạn muốn khám phá Hà Nội như thế nào?</h2>
          <p className="hc-muted mt-1 text-ink-soft">Nhận trợ giúp bằng giọng nói, tìm thông tin, kiểm tra khả năng tiếp cận và đặt dịch vụ phù hợp với nhu cầu của bạn.</p>
          <div className="mt-4 flex items-center gap-2">
            <Link href="/search" className="flex min-h-[54px] flex-1 items-center gap-3 rounded-2xl border border-line bg-white px-4 text-left text-ink-soft shadow-sm hc-surface hc-border">
              <SearchIcon size={21} /> <span>Bạn muốn đi đâu, làm gì ở Hà Nội?</span>
            </Link>
            <Link href="/search" aria-label="Tìm bằng giọng nói" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-ink shadow-card hover:scale-105"><MicIcon size={22} /></Link>
            <Link href="/assistant" aria-label="Mở trợ lý camera" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4ead7] text-ink shadow-card hover:scale-105"><CameraIcon size={22} /></Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">Gợi ý nhanh:</span>
            {["Hồ Gươm", "Văn Miếu", "Phố cổ", "Chó dẫn đường", "Khách sạn tiếp cận", "Vé tham quan"].map((label) => (
              <Link key={label} href={`/search?q=${encodeURIComponent(label)}`} className="rounded-full bg-surface-alt px-4 py-2 font-semibold hover:underline">{label}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Choose by Need Section */}
      <section className="container-page pb-11" aria-labelledby="need-heading">
        <div className="mb-4">
          <h2 id="need-heading" className="text-3xl">Chọn theo nhu cầu tiếp cận</h2>
          <p className="hc-muted mt-1 text-ink-soft">Lựa chọn nhanh các dịch vụ và thông tin phù hợp với hành trình của bạn.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {needCards.map(({ icon: Icon, label, href, tone }) => (
            <Link key={label} href={href} className="group flex min-h-[108px] items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover hc-surface hc-border lg:flex-col lg:items-start">
              <RoundIcon className={tone}><Icon size={23} /></RoundIcon>
              <span className="whitespace-pre-line font-bold leading-tight">{label}</span>
              <span aria-hidden="true" className="ml-auto text-xl lg:hidden">›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Accessible Destinations */}
      <section className="border-y border-line bg-[#fffaf2] py-12 hc-surface hc-border" aria-labelledby="discover-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 id="discover-heading" className="text-4xl">Điểm đến nổi bật tại Hà Nội</h2>
              <p className="hc-muted mt-1 text-ink-soft">Dữ liệu địa điểm đã đối chiếu cùng thông tin tiếp cận được khảo sát rõ ràng.</p>
            </div>
            <Link href="/explore?cat=destination" className="btn-ghost hc-border !min-h-[42px] !px-5 !py-2 text-sm">Xem tất cả điểm đến ›</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinationCards.map((card) => (
              <Link key={card.title} href={card.href} className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover hc-surface hc-border">
                <VerifiedImage src={card.image.src} fallback={FALLBACK} alt={card.image.alt} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-[22px] font-bold">{card.title}</h3>
                  <p className="hc-muted mt-2 flex items-center gap-2 text-sm text-ink-soft"><MapPinIcon size={17} /> {card.area}</p>
                  <ul className="hc-muted mt-2 space-y-1 text-sm text-ink-soft">
                    {card.facts.map((f) => <li key={f} className="flex items-center gap-2"><AccessibleIcon size={17} /> {f}</li>)}
                  </ul>
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${card.badgeClass}`}>{card.badge}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONSOLIDATED SECTION 1: Trợ lý du lịch & Công nghệ tiếp cận thông minh */}
      <section className="container-page py-12" aria-labelledby="smart-assistant-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="chip hc-surface hc-border text-xs font-bold text-primary">Công nghệ hỗ trợ du lịch</span>
            <h2 id="smart-assistant-heading" className="mt-2 text-4xl sm:text-5xl">
              Trợ lý thông minh <span className="text-[#eb5d27]">trên từng bước đi</span>
            </h2>
            <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">
              Kết hợp sức mạnh của giọng nói, trí tuệ nhân tạo thị giác, bản đồ tiếp cận và sự đồng hành của con người để mang lại sự tự tin tối đa.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreAssistants.map(({ icon: Icon, title, desc, href, action, tone }) => (
            <article key={title} className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover hc-surface hc-border">
              <RoundIcon className={tone}><Icon size={24} /></RoundIcon>
              <h3 className="mt-4 text-2xl font-bold">{title}</h3>
              <p className="hc-muted mt-2 flex-1 text-sm leading-6 text-ink-soft">{desc}</p>
              <div className="mt-6 pt-4 border-t border-line hc-border">
                <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  {action} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONSOLIDATED SECTION 2: Quy trình 4 bước khám phá Hà Nội */}
      <section className="border-y border-line bg-[#fffdf8] py-12 hc-surface hc-border" aria-labelledby="process-heading">
        <div className="container-page">
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8">
            <span className="chip hc-surface hc-border text-xs font-bold text-primary">Trải nghiệm liền mạch</span>
            <h2 id="process-heading" className="mt-2 text-3xl sm:text-4xl">
              Hành trình 4 bước cùng <span className="text-[#eb5d27]">WayEcho</span>
            </h2>
            <p className="hc-muted mt-1 max-w-2xl text-ink-soft">
              Từ ý định khám phá đến khi an toàn trở về, WayEcho thiết kế quy trình đơn giản, rõ ràng và tối ưu nhất cho người khiếm thị.
            </p>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map(({ n, icon: Icon, title, desc }) => (
                <li key={n} className="relative rounded-2xl border border-line bg-surface-alt/40 p-5 hc-surface hc-border">
                  <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-ink shadow-sm">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="hc-muted mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* INTERACTIVE GALLERY WITH MODAL */}
      <HomeGallery />

      {/* Community Stories */}
      <section className="border-t border-line bg-[#fffaf2] py-12 hc-surface hc-border" aria-labelledby="stories-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 id="stories-heading" className="text-4xl">Những <span className="text-[#eb5d27]">trải nghiệm thật</span></h2>
              <p className="hc-muted mt-1 text-ink-soft">Chia sẻ và đánh giá thực tế từ cộng đồng người khiếm thị và người đồng hành.</p>
            </div>
            <Link href="/review" className="btn-ghost hc-border !min-h-[42px] !px-5 !py-2 text-sm">Gửi đánh giá hoặc đóng góp →</Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {stories.map((story) => (
              <article key={story.name} className="rounded-2xl border border-line bg-white p-6 shadow-card hc-surface hc-border">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f3e3c5] text-xl font-bold text-[#8b5b12]" aria-hidden="true">
                    {story.initial}
                  </div>
                  <div>
                    <p className="text-sm leading-6 text-ink-soft hc-muted">{story.quote}</p>
                    <p className="mt-3 font-bold">{story.name}</p>
                    <p className="text-xs text-ink-soft hc-muted">{story.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* App & Emergency Help */}
      <section className="container-page py-12" id="download-app" aria-labelledby="download-heading">
        <div className="overflow-hidden rounded-[28px] border border-[#eedfc9] bg-[linear-gradient(110deg,#fff7e9_0%,#fffdf9_55%,#f8ebd2_100%)] shadow-card hc-surface hc-border">
          <div className="grid items-center gap-8 p-7 lg:grid-cols-[1.05fr_.95fr] lg:p-10">
            <div>
              <h2 id="download-heading" className="text-4xl sm:text-5xl">Cài đặt ứng dụng <span className="text-[#eb5d27]">WayEcho</span></h2>
              <p className="mt-2 text-xl font-semibold">Khám phá Hà Nội luôn sẵn sàng trên điện thoại của bạn.</p>
              <p className="hc-muted mt-4 max-w-2xl text-ink-soft">
                WayEcho hỗ trợ Progressive Web App (PWA) cài đặt trực tiếp không cần tải từ kho ứng dụng, hoạt động mượt mà với VoiceOver và TalkBack trên iOS và Android.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/app" aria-label="Xem hướng dẫn cài WayEcho trên iPhone hoặc iPad" className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90">
                  <span className="block text-[10px] uppercase tracking-wider">Cài đặt trên iOS</span>
                  <span className="text-xl font-bold"> Thêm vào MH chính</span>
                </Link>
                <Link href="/app" aria-label="Xem hướng dẫn cài WayEcho trên Android" className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90">
                  <span className="block text-[10px] uppercase tracking-wider">Cài đặt trên Android</span>
                  <span className="text-xl font-bold">▶ Cài đặt Web App</span>
                </Link>
              </div>
              <p className="hc-muted mt-5 flex items-center gap-3 italic text-ink-soft">
                <span aria-hidden="true" className="inline-block h-[4px] w-10 rounded-full bg-primary" /> Cùng WayEcho, Hà Nội gần hơn, cho mọi người!
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-[1fr_230px] sm:items-center">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <RoundIcon className="bg-[#f6a62e] text-ink"><MicIcon size={22} /></RoundIcon>
                  <div><h3 className="text-lg font-bold">Tìm kiếm bằng giọng nói</h3><p className="hc-muted mt-0.5 text-xs text-ink-soft">Nói nhu cầu để tìm địa điểm và dịch vụ lập tức.</p></div>
                </div>
                <div className="flex gap-4">
                  <RoundIcon className="bg-[#3f7dca]"><BookmarkIcon size={22} /></RoundIcon>
                  <div><h3 className="text-lg font-bold">Lưu hành trình cá nhân</h3><p className="hc-muted mt-0.5 text-xs text-ink-soft">Lưu lại điểm đến yêu thích và lên lịch trình linh hoạt.</p></div>
                </div>
                <div className="flex gap-4">
                  <RoundIcon className="bg-[#ec633b]"><HeadphonesIcon size={22} /></RoundIcon>
                  <div><h3 className="text-lg font-bold">Hỗ trợ khẩn cấp SOS</h3><p className="hc-muted mt-0.5 text-xs text-ink-soft">Lấy tọa độ GPS, gửi SMS cho người thân và gọi 115 ngay trong một màn hình.</p></div>
                </div>
              </div>
              <div className="relative mx-auto w-[220px] rounded-[34px] border-[8px] border-[#111827] bg-white p-3 shadow-2xl" aria-label="Mô phỏng giao diện ứng dụng WayEcho trên điện thoại">
                <div className="mx-auto mb-3 h-2 w-20 rounded-full bg-[#1f2937]" />
                <div className="flex items-center gap-2 text-sm font-black"><span className="text-[#ef6d28]">⌖</span> Way<span className="text-[#ef6d28]">Echo</span></div>
                <div className="mt-3 rounded-xl border border-line bg-white p-2 text-[10px] shadow-sm">Bạn muốn khám phá Hà Nội điều gì? <span className="float-right rounded-full bg-primary p-1"><MicIcon size={12} /></span></div>
                <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[8px]"><span>♿<br />Điểm đến</span><span>🍴<br />Ẩm thực</span><span>🏛<br />Văn hóa</span><span>🧭<br />Bản đồ</span></div>
                <div className="mt-3 text-[10px] font-bold">Khám phá Hà Nội</div>
                <div className="mt-1 overflow-hidden rounded-xl"><VerifiedImage src={HOME_IMAGES.hoGuom.src} fallback={FALLBACK} alt="Ảnh Cầu Thê Húc tại Hồ Hoàn Kiếm hiển thị trong mô phỏng màn hình ứng dụng WayEcho." className="h-28 w-full object-cover" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Grid */}
        <div className="mt-5 rounded-[22px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">Cần hỗ trợ thêm?</h2>
              <p className="hc-muted mt-1 text-ink-soft">Chúng tôi luôn sẵn sàng đồng hành cùng bạn trong mọi chặng đường.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/help" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border">
                <RoundIcon className="bg-[#dceaff] text-[#3d73bc]"><span aria-hidden="true" className="text-xl">▤</span></RoundIcon>
                <div><h3 className="text-base font-bold">Hướng dẫn sử dụng</h3><p className="hc-muted mt-1 text-xs text-ink-soft">Tìm hiểu cách dùng WayEcho và phím tắt.</p></div>
              </Link>
              <Link href="/help#contact" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border">
                <RoundIcon className="bg-[#dff4e5] text-[#238a4d]"><HeadphonesIcon size={21} /></RoundIcon>
                <div><h3 className="text-base font-bold">Liên hệ hỗ trợ</h3><p className="hc-muted mt-1 text-xs text-ink-soft">Đội ngũ hỗ trợ và cộng đồng đồng hành.</p></div>
              </Link>
              <Link href="/services#guides" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border">
                <RoundIcon className="bg-[#ffe9ca] text-[#d57d0a]"><UserIcon size={21} /></RoundIcon>
                <div><h3 className="text-base font-bold">Guide & Assistant</h3><p className="hc-muted mt-1 text-xs text-ink-soft">Kết nối hướng dẫn viên chuyên nghiệp.</p></div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
