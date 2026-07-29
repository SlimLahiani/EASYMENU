import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kayusushi.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin", // Hide admin console from web search engines
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
