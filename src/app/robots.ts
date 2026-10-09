import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/"],
    },
    sitemap: "https://fieldnotesanddata.com/sitemap.xml",
    host: "https://fieldnotesanddata.com",
  };
}
