import { draftMode } from "next/headers";
import { client } from "./client";

type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
};

export async function sanityFetch<T>({
  query,
  params = {},
}: SanityFetchOptions): Promise<T> {
  const { isEnabled } = await draftMode();
  const localDraftPreview = process.env.NODE_ENV === "development" && isEnabled;

  if (localDraftPreview) {
    const token = process.env.SANITY_API_READ_TOKEN;
    if (!token) {
      throw new Error("SANITY_API_READ_TOKEN is required for local draft preview.");
    }

    return client.withConfig({
      token,
      useCdn: false,
      perspective: "drafts",
    }).fetch<T>(query, params, { cache: "no-store" });
  }

  return client.withConfig({ perspective: "published" }).fetch<T>(
    query,
    params,
    { next: { revalidate: 60 } },
  );
}
