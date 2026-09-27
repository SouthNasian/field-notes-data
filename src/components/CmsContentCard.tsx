import Link from "next/link";
import { VisualPlaceholder } from "./VisualPlaceholder";

type Item = {
  title: string;
  subtitle?: string | null;
  slug: string;
  logNumber?: number | null;
  tags?: string[] | null;
  categories?: string[] | null;
};

export function CmsContentCard({item, compact=false}:{item:Item;compact?:boolean}) {
  const number = item.logNumber ? String(item.logNumber).padStart(3,"0") : "—";
  const label = item.categories?.[0] || "DATA + AI";
  return (
    <article className={`content-card ${compact ? "compact" : ""}`}>
      <Link href={`/inquiries/${item.slug}`} aria-label={item.title}>
        <VisualPlaceholder type="chart" label={`Inquiry ${number}`} />
      </Link>
      <div className="card-copy">
        <p className="eyebrow">INQUIRY {number} · {label.toUpperCase()}</p>
        <h3><Link href={`/inquiries/${item.slug}`}>{item.title}</Link></h3>
        {!compact && item.subtitle && <p>{item.subtitle}</p>}
        {!!item.tags?.length && <div className="tag-row">{item.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>}
      </div>
    </article>
  );
}
