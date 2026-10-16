import { getDestination } from "@/data/destinations";
import DestinationView from "./DestinationView";

export async function generateMetadata({ searchParams }) {
  const { d } = await searchParams;
  if (!d) {
    return {
      title: "Điểm đến du lịch cho người khiếm thị tại Hà Nội | WayEcho",
      description: "Danh sách các điểm đến tại Hà Nội kèm thông tin tiếp cận, trạng thái xác minh lối đi, audio guide và hỗ trợ cho người mù và người nhìn kém.",
      alternates: { canonical: "/destination" },
    };
  }

  const dest = getDestination(d);
  if (!dest) {
    return { title: "Không tìm thấy điểm đến | WayEcho" };
  }

  return {
    title: `${dest.name} – Thông tin tiếp cận cho người khiếm thị | WayEcho`,
    description: `${dest.summary} Thông tin lối vào, âm thanh thuyết minh và mức độ tiếp cận dành cho du khách khiếm thị tại ${dest.area}.`,
    alternates: { canonical: `/destination?d=${dest.slug}` },
    openGraph: {
      title: `${dest.name} – Thông tin tiếp cận cho người khiếm thị | WayEcho`,
      description: dest.summary,
      url: `/destination?d=${dest.slug}`,
      images: [{ url: dest.image, alt: dest.alt }],
    },
  };
}

export default async function DestinationPage({ searchParams }) {
  const { d } = await searchParams;
  const dest = d ? getDestination(d) : null;

  const jsonLd = dest ? {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.summary,
    image: dest.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: dest.address,
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    geo: dest.coordinates ? {
      "@type": "GeoCoordinates",
      latitude: dest.coordinates.lat,
      longitude: dest.coordinates.lng,
    } : undefined,
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <DestinationView />
    </>
  );
}
