import { MetadataRoute } from "next";
import { INITIAL_DISHES } from "@/data/menuData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kayusushi.com";

  // Base routes
  const routes = [
    "",
    "/menu",
    "/admin",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic dishes routes
  const dishRoutes = INITIAL_DISHES.map((dish) => ({
    url: `${baseUrl}/dish/${dish.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...dishRoutes];
}
