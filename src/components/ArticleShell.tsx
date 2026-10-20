import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { VisualPlaceholder } from "./VisualPlaceholder";

type ArticleShellProps = {
  type: string;
  number: string;
  eyebrow: string;
  title: string;
  dek: string;
  date: string;
  visual: string;
  children: ReactNode;
  heroImageUrl?: string;
  heroImageAlt?: string;
  /** Optional opening narrative displayed before a full-width dashboard. */
  openingContent?: ReactNode;
  /** Optional content displayed at the full shell width between narrative sections. */
  fullWidthContent?: ReactNode;
};

export function ArticleShell({
  type, number, eyebrow, title, dek, date, visual,
  children, openingContent, fullWidthContent, heroImageUrl, heroImageAlt,
}: ArticleShellProps) {
  const hasSplitLayout = openingContent != null && fullWidthContent != null;

  return (
    <main>
      <section className="article-hero shell">
        <p className="eyebrow">{type.toUpperCase()} {number} · {eyebrow}</p>
        <h1>{title}</h1>
        <p className="article-dek">{dek}</p>
        <p className="article-meta">{date} · FIELD NOTES &amp; DATA</p>
        {heroImageUrl ? (
          <div className="visual" style={{ position: "relative" }}>
            <Image
              src={heroImageUrl}
              alt={heroImageAlt || `${title} hero image`}
              fill
              unoptimized
              sizes="(max-width: 650px) 100vw, (max-width: 900px) 95vw, 1200px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <VisualPlaceholder type={visual} label={`${type} hero visual`} />
        )}
      </section>

      {hasSplitLayout ? (
        <>
          <section className="article-layout shell">
            <aside className="toc">
              <p className="eyebrow">ON THIS PAGE</p>
              <a href="#opening">Opening</a>
              <a href="#dashboard">Dashboard</a>
              <a href="#middle">Investigation</a>
              <a href="#answer">Finding</a>
              <a href="#methods">Behind the work</a>
            </aside>
            <article className="prose">{openingContent}</article>
          </section>
          <section id="dashboard" className="shell" aria-label="Interactive research dashboard">
            {fullWidthContent}
          </section>
          <section className="article-layout shell">
            <div aria-hidden="true" />
            <article className="prose">{children}</article>
          </section>
        </>
      ) : (
        <section className="article-layout shell">
          <aside className="toc">
            <p className="eyebrow">ON THIS PAGE</p>
            <a href="#opening">Opening</a>
            <a href="#middle">Investigation</a>
            <a href="#answer">Finding</a>
            <a href="#methods">Behind the work</a>
          </aside>
          <article className="prose">{children}</article>
        </section>
      )}

      <section className="next-strip shell">
        <span>Continue exploring</span>
        <Link href="/inquiries">Browse all inquiries →</Link>
      </section>
    </main>
  );
}
