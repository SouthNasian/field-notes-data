import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import { ArticleShell } from "@/components/ArticleShell";
import { PortableArticle } from "@/sanity/components/PortableArticle";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { CASE_STUDY_QUERY } from "@/sanity/lib/queries";

type DataSource = {
  name?: string | null;
  url?: string | null;
  notes?: string | null;
};

type CaseStudy = {
  title: string;
  subtitle?: string | null;
  slug: string;
  publishedAt?: string | null;
  logNumber?: number | string | null;
  heroImage?: {
    asset?: { _ref?: string | null } | null;
    alt?: string | null;
  } | null;
  body?: PortableTextBlock[] | null;
  tools?: string[] | null;
  dataSources?: DataSource[] | null;
  aiAssistance?: string | null;
  humanJudgment?: string | null;
  limitations?: string | null;
  categories?: string[] | null;
  dashboardUrl?: string | null;
};

type PageProps = { params: Promise<{ slug: string }> };

const NORTH_CAROLINA_DASHBOARD_URL =
  "/inquiries/north-carolina-industry-growth";
const NORTH_CAROLINA_CASE_STUDY_SLUG =
  "building-nc-industry-growth-dashboard";

function formattedDate(value?: string | null) {
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await sanityFetch<CaseStudy | null>({
    query: CASE_STUDY_QUERY,
    params: { slug },
  });

  if (!item) {
    return { title: "Case Study Not Found", robots: { index: false, follow: false } };
  }

  const description =
    item.subtitle?.trim() ||
    "A technical case study in data visualization, analytics, and AI-assisted development.";
  const url = `/case-studies/${encodeURIComponent(slug)}`;

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
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Field Notes & Data — Digital Expedition Log",
        },
      ],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await sanityFetch<CaseStudy | null>({
    query: CASE_STUDY_QUERY,
    params: { slug },
  });
  if (!item) notFound();

  const number = item.logNumber != null
    ? String(item.logNumber).padStart(3, "0")
    : "—";
  const isNorthCarolinaCaseStudy = slug === NORTH_CAROLINA_CASE_STUDY_SLUG;
  const dashboardUrl = isNorthCarolinaCaseStudy
    ? NORTH_CAROLINA_DASHBOARD_URL
    : item.dashboardUrl?.trim();
  // Display the published Sanity hero image when available.
  const heroImageUrl = item.heroImage?.asset?._ref
    ? urlFor(item.heroImage).width(1800).auto("format").url()
    : undefined;

  return (
    <ArticleShell
      type="Case Study"
      number={number}
      eyebrow={item.categories?.[0] || "AI + ANALYTICS"}
      title={item.title}
      dek={item.subtitle || ""}
      date={formattedDate(item.publishedAt)}
      visual="dashboard"
      heroImageUrl={heroImageUrl}
      heroImageAlt={item.heroImage?.alt || undefined}
    >
      <section id="opening">
        <p className="eyebrow">MISSION BRIEF</p>
        <h2>From public data to an interactive analytics experience.</h2>
        {isNorthCarolinaCaseStudy ? (
          <p>
            This project turns North Carolina industry employment and wage data
            into three interactive visualizations, supported by transparent
            methodology and an editorial research narrative. The case study
            documents the application architecture, analytical decisions,
            AI-assisted development, and production validation.
          </p>
        ) : (
          <p>{item.subtitle || "Explore the approach, implementation, and validation behind this project."}</p>
        )}
        {item.tools?.length ? (
          <p><strong>Tools:</strong> {item.tools.join(" · ")}</p>
        ) : null}
      </section>

      {dashboardUrl ? (
        <section>
          <p className="eyebrow">THE DATA PRODUCT</p>
          <h2>Explore the published interactive dashboard.</h2>
          <p>
            Open the companion inquiry to explore the visualizations and
            analytical findings. The technical implementation is documented below.
          </p>
          <Link className="text-link" href={dashboardUrl}>
            Open the interactive dashboard →
          </Link>
        </section>
      ) : null}

      <section id="middle">
        <p className="eyebrow">TECHNICAL FIELD LOG</p>
        <h2>Architecture, methodology, and implementation.</h2>
        <PortableArticle value={item.body ?? undefined} />
      </section>

      {item.aiAssistance ? (
        <section>
          <p className="eyebrow">AI WORKFLOW</p>
          <h2>How AI supported development.</h2>
          <p style={{ whiteSpace: "pre-line" }}>{item.aiAssistance}</p>
        </section>
      ) : null}

      {item.humanJudgment ? (
        <section id="answer">
          <p className="eyebrow">HUMAN REVIEW</p>
          <h2>Analytical judgment and validation.</h2>
          <p style={{ whiteSpace: "pre-line" }}>{item.humanJudgment}</p>
        </section>
      ) : null}

      <section id="methods" className="methods-box">
        <p className="eyebrow">REPRODUCIBILITY</p>
        <h2>Data sources and limitations.</h2>
        {item.dataSources?.map((source, index) => (
          <p key={`${source.name ?? "source"}-${index}`}>
            <strong>
              {source.url ? (
                <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.name || "Data source"}
                </a>
              ) : (
                source.name || "Data source"
              )}
            </strong>
            {source.notes ? ` — ${source.notes}` : ""}
          </p>
        ))}
        {item.limitations ? (
          <p style={{ whiteSpace: "pre-line" }}>{item.limitations}</p>
        ) : null}
      </section>
    </ArticleShell>
  );
}
