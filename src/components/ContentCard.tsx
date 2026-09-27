import Link from "next/link";
import type { ContentCard as Card } from "@/lib/sampleContent";
import { VisualPlaceholder } from "./VisualPlaceholder";

function hrefFor(item: Card) {
  if (item.kind === "Inquiry") return `/inquiries/${item.slug}`;
  if (item.kind === "Field Note") return `/field-notes/${item.slug}`;
  return `/case-studies/${item.slug}`;
}

export function ContentCard({ item, compact = false }: { item: Card; compact?: boolean }) {
  return (
    <article className={`content-card ${compact ? "compact" : ""}`}>
      <Link href={hrefFor(item)} aria-label={item.title}>
        <VisualPlaceholder type={item.visual} label={`${item.kind} ${item.number}`} />
      </Link>
      <div className="card-copy">
        <p className="eyebrow">{item.kind.toUpperCase()} {item.number} · {item.eyebrow}</p>
        <h3><Link href={hrefFor(item)}>{item.title}</Link></h3>
        {!compact && <p>{item.summary}</p>}
        <div className="tag-row">{item.tags.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div>
      </div>
    </article>
  );
}
