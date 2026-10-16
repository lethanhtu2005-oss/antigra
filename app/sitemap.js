import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";
import { catalog } from "@/data/catalog";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wayecho.vn";
  const now = new Date();

  const staticRoutes = [
    "",
    "/explore",
    "/services",
    "/guide-dog",
    "/cam-nang",
    "/assistant",
    "/navigation",
    "/sos",
    "/search",
    "/profile",
    "/my-trip",
    "/my-booking",
    "/help",
    "/sitemap",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/explore") || route.startsWith("/services") ? 0.8 : 0.6,
  }));

  const destinationRoutes = destinations.map((d) => ({
    url: `${baseUrl}/destination?d=${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${baseUrl}/cam-nang/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const catalogRoutes = catalog.map((c) => ({
    url: `${baseUrl}/item?id=${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...destinationRoutes, ...articleRoutes, ...catalogRoutes];
}
