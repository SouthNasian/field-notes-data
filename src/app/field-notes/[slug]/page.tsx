import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";

import { ArticleShell } from "@/components/ArticleShell";
import { PortableArticle } from "@/sanity/components/PortableArticle";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FIELD_NOTE_QUERY } from "@/sanity/lib/queries";

type FieldNote = {
  title: string;
  subtitle?: string | null;
  publishedAt?: string | null;
  fieldDate?: string | null;
  fieldLocation?: string | null;
  logNumber?: number | null;
  categories?: string[] | null;
  body?: PortableTextBlock[];
  humanJudgment?: string | null;
  limitations?: string | null;
  heroImage?: {
    alt?: string | null;
  } | null;
  heroImageUrl?: string | null;
};

type FieldNotePageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value?: string | null): string {
  if (!value) return "DATE NOT SET";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "DATE NOT SET";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export async function generateMetadata({
  params,
}: FieldNotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await sanityFetch<FieldNote | null>({
    query: FIELD_NOTE_QUERY,
    params: { slug },
  });

  if (!item) {
    return {
      title: "Field Note Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description =
    item.subtitle?.trim() ||
    "A Field Notes & Data journal entry exploring observations, experiences, and insights from the field.";
  const url = `/field-notes/${encodeURIComponent(slug)}`;

  return {
    title: item.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "Field Notes & Data",
      title: `${item.title} | Field Notes & Data`,
      description,
      url,
      images: [
        {
          url: item.heroImageUrl || "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: item.heroImage?.alt || "Field Notes & Data — Digital Expedition Log",
        },
      ],
    },
  };
}

export default async function FieldNotePage({ params }: FieldNotePageProps) {
  const { slug } = await params;
  const item = await sanityFetch<FieldNote | null>({
    query: FIELD_NOTE_QUERY,
    params: { slug },
  });

  if (!item) notFound();

  const number = item.logNumber
    ? String(item.logNumber).padStart(3, "0")
    : "—";

  return (
    <ArticleShell
      type="Field Note"
      number={number}
      eyebrow={item.categories?.[0] || "FROM THE FIELD"}
      title={item.title}
      dek={item.subtitle || ""}
      date={formatDate(item.fieldDate || item.publishedAt)}
      visual="photo"
      heroImageUrl={item.heroImageUrl || undefined}
      heroImageAlt={item.heroImage?.alt || item.title}
    >
      <section id="opening">
        <p className="eyebrow">THE MOMENT</p>
        <PortableArticle value={item.body} />
      </section>

      <section id="middle">
        <p className="eyebrow">THE OBSERVATION</p>
        <h2>What stood out?</h2>
        <p>
          {item.humanJudgment ||
            "Add the observation or reflection in Sanity."}
        </p>
      </section>

      <section id="methods" className="methods-box">
        <p className="eyebrow">FIELD DETAILS</p>
        <h2>Context without clutter.</h2>
        <p>
          {item.fieldLocation || "Location not specified"} ·{" "}
          {formatDate(item.fieldDate || item.publishedAt)}
        </p>
        {item.limitations && <p>{item.limitations}</p>}
      </section>
    </ArticleShell>
  );
}
