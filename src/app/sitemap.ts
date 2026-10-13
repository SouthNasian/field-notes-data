import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";



const BASE_URL = "https://fieldnotesanddata.com";

const SITEMAP_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    contentType in ["inquiry", "fieldNote", "caseStudy"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ] {
    "slug": slug.current,
    contentType,
    _updatedAt
  }
`);

const SITEMAP_EXPEDITIONS_QUERY = defineQuery(`
  *[
    _type == "expedition" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ] {
    "slug": slug.current,
    _updatedAt
  }
`);

type SitemapPost = {
  slug: string;
  contentType: "inquiry" | "fieldNote" | "caseStudy";
  _updatedAt: string;
};

type SitemapExpedition = {
  slug: string;
  _updatedAt: string;
};

const postPaths: Record<SitemapPost["contentType"], string> = {
  inquiry: "/inquiries",
  fieldNote: "/field-notes",
  caseStudy: "/case-studies",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const [posts, expeditions] = await Promise.all([
  client
    .withConfig({ useCdn: false, perspective: "published" })
    .fetch<SitemapPost[]>(SITEMAP_POSTS_QUERY, {}, {
      cache: "no-store",
    }),

  client
    .withConfig({ useCdn: false, perspective: "published" })
    .fetch<SitemapExpedition[]>(SITEMAP_EXPEDITIONS_QUERY, {}, {
      cache: "no-store",
    }),
]);

  const staticPaths = [
    "/",
    "/inquiries",
    "/field-notes",
    "/ai-analytics",
    "/about",
    "/contact",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}${postPaths[post.contentType]}/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post._updatedAt),
  }));

  const expeditionEntries: MetadataRoute.Sitemap = expeditions.map(
    (expedition) => ({
      url: `${BASE_URL}/expeditions/${encodeURIComponent(expedition.slug)}`,
      lastModified: new Date(expedition._updatedAt),
    }),
  );

  return [...staticEntries, ...postEntries, ...expeditionEntries];
}
