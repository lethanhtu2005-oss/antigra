import { notFound } from "next/navigation";
import { getArticle, articles } from "@/data/articles";
import ArticleDetailClient from "./ArticleDetailClient";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const art = getArticle(slug);
  if (!art) return { title: "Không tìm thấy bài viết" };

  return {
    title: `${art.title} | WayEcho`,
    description: art.summary,
    alternates: { canonical: `/cam-nang/${art.slug}` },
    openGraph: {
      title: `${art.title} | WayEcho`,
      description: art.summary,
      url: `/cam-nang/${art.slug}`,
      images: [{ url: art.image, alt: art.alt }],
      type: "article",
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const art = getArticle(slug);
  if (!art) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: art.title,
    description: art.summary,
    image: art.image,
    datePublished: "2026-10-15T08:00:00+07:00",
    dateModified: "2026-10-16T12:00:00+07:00",
    author: {
      "@type": "Organization",
      name: art.author,
    },
    publisher: {
      "@type": "Organization",
      name: "WayEcho",
      logo: {
        "@type": "ImageObject",
        url: "https://wayecho.vn/icons/icon-512.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ArticleDetailClient article={art} />
    </>
  );
}
