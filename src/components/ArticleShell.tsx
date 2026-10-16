import Link from "next/link";
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
  /** Optional opening narrative displayed before a full-width dashboard. */
  openingContent?: ReactNode;
  /** Optional content displayed at the full shell width between narrative sections. */
  fullWidthContent?: ReactNode;
};

export function ArticleShell({
  type, number, eyebrow, title, dek, date, visual,
  children, openingContent, fullWidthContent,
}: ArticleShellProps) {
  const hasSplitLayout = openingContent != null && fullWidthContent != null;

  return (
    <main>
      <section className="article-hero shell">
        <p className="eyebrow">{type.toUpperCase()} {number} · {eyebrow}</p>
        <h1>{title}</h1>
        <p className="article-dek">{dek}</p>
        <p className="article-meta">{date} · FIELD NOTES &amp; DATA</p>
        <VisualPlaceholder type={visual} label={`${type} hero visual`} />
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
