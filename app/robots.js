export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wayecho.vn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/staff",
          "/staff/*",
          "/api",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
