import Link from "next/link";
import { VisualPlaceholder } from "./VisualPlaceholder";

export type LiveItem = {
  title:string; subtitle?:string|null; slug:string; contentType?:string|null;
  logNumber?:number|null; categories?:string[]|null; tags?:string[]|null;
};

function kindFor(type?:string|null) {
  if (type === "fieldNote") return "Field Note";
  if (type === "caseStudy") return "Case Study";
  return "Inquiry";
}
function hrefFor(item:LiveItem) {
  if (item.contentType === "fieldNote") return `/field-notes/${item.slug}`;
  if (item.contentType === "caseStudy") return `/case-studies/${item.slug}`;
  return `/inquiries/${item.slug}`;
}
function visualFor(type?:string|null):"chart"|"photo"|"dashboard" {
  if (type === "fieldNote") return "photo";
  if (type === "caseStudy") return "dashboard";
  return "chart";
}

export function LiveContentCard({item,compact=false}:{item:LiveItem;compact?:boolean}) {
  const kind=kindFor(item.contentType);
  const number=item.logNumber ? String(item.logNumber).padStart(3,"0") : "—";
  const eyebrow=item.categories?.[0] || "FIELD NOTES & DATA";
  return <article className={`content-card ${compact?"compact":""}`}>
    <Link href={hrefFor(item)} aria-label={item.title}><VisualPlaceholder type={visualFor(item.contentType)} label={`${kind} ${number}`} /></Link>
    <div className="card-copy">
      <p className="eyebrow">{kind.toUpperCase()} {number} · {eyebrow.toUpperCase()}</p>
      <h3><Link href={hrefFor(item)}>{item.title}</Link></h3>
      {!compact && item.subtitle && <p>{item.subtitle}</p>}
      {!!item.tags?.length && <div className="tag-row">{item.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>}
    </div>
  </article>
}
