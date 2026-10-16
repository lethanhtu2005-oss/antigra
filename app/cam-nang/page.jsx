import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
import { articles } from "@/data/articles";
import { AccessibleIcon, SpeakerIcon, MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Cẩm nang du lịch Hà Nội cho người khiếm thị – WayEcho",
  description: "Tổng hợp bài viết, kinh nghiệm, hướng dẫn di chuyển, ẩm thực và đồng hành cùng chó dẫn đường tại Hà Nội dành cho người khiếm thị và người nhìn kém.",
  alternates: { canonical: "/cam-nang" },
  openGraph: {
    title: "Cẩm nang du lịch Hà Nội cho người khiếm thị | WayEcho",
    description: "Kinh nghiệm thực tế, quy định chó dẫn đường và hướng dẫn phương tiện giao thông tiếp cận tại Hà Nội.",
    url: "/cam-nang",
  },
};

export default function HandbookPage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <span aria-current="page" className="font-semibold text-ink">Cẩm nang</span>
      </nav>

      <div className="mt-4 max-w-3xl">
        <span className="chip hc-surface hc-border bg-primary font-bold">
          <AccessibleIcon size={16} /> Cẩm nang du lịch tiếp cận
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Cẩm nang du lịch Hà Nội</h1>
        <p className="hc-muted mt-3 text-lg leading-relaxed text-ink-soft">
          Những kinh nghiệm thực tế, lộ trình tiếp cận, hướng dẫn sử dụng phương tiện và lưu ý văn hóa giúp người mù và người nhìn kém khám phá thủ đô an toàn và trọn vẹn nhất.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="card hc-surface hc-border flex flex-col justify-between overflow-hidden border border-line hover:shadow-card-hover"
          >
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-surface-alt">
                <VerifiedImage
                  src={art.image}
                  fallback="/assets/images/location-image-unavailable.svg"
                  alt={art.alt}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-soft hc-muted">
                  <span className="rounded-full bg-surface-alt px-3 py-1 text-ink hc-surface hc-border">{art.category}</span>
                  <span>{art.date} · {art.readTime}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-tight hover:text-accent-dark">
                  <Link href={`/cam-nang/${art.slug}`}>{art.title}</Link>
                </h2>
                <p className="hc-muted mt-3 text-sm leading-relaxed text-ink-soft">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="border-t border-line p-6 pt-4 hc-border flex items-center justify-between">
              <Link
                href={`/cam-nang/${art.slug}`}
                className="btn-primary !min-h-[40px] !py-2 text-sm"
              >
                Đọc bài viết →
              </Link>
              <span className="text-xs text-ink-soft hc-muted">Bởi {art.author}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
