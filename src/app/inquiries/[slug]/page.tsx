import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/ArticleShell";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { PortableArticle } from "@/sanity/components/PortableArticle";
import { sanityFetch } from "@/sanity/lib/fetch";
import { INQUIRY_QUERY } from "@/sanity/lib/queries";
import type {PortableTextBlock} from "@portabletext/types";

type Inquiry = {
  title:string; subtitle?:string|null; slug:string; publishedAt?:string|null;
  logNumber?:number|null; categories?:string[]|null; tags?:string[]|null;
  body?:PortableTextBlock[]; tools?:string[]|null;
  aiAssistance?:string|null; humanJudgment?:string|null; limitations?:string|null;
  dataSources?:{name?:string;url?:string;notes?:string}[]|null;
};

function displayDate(value?:string|null) {
  if (!value) return "DATE NOT SET";
  return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(value));
}

export default async function InquiryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await sanityFetch<Inquiry|null>({query: INQUIRY_QUERY, params:{slug}});
  if (!item) notFound();
  const number=item.logNumber ? String(item.logNumber).padStart(3,"0") : "—";
  const eyebrow=item.categories?.[0] || "DATA + AI";

  return (
    <ArticleShell type="Inquiry" number={number} eyebrow={eyebrow} title={item.title}
      dek={item.subtitle || ""} date={displayDate(item.publishedAt)} visual="chart">
      <section id="opening">
        <p className="eyebrow">THE INQUIRY</p>
        <PortableArticle value={item.body} />
      </section>
      <section id="middle">
        <p className="eyebrow">TOOLS + DATA</p>
        <h2>How the investigation was built.</h2>
        {!!item.tools?.length && <div className="tag-row">{item.tools.map(t=><span key={t}>{t}</span>)}</div>}
        {!!item.dataSources?.length && item.dataSources.map((d,i)=><p key={i}><b>{d.name || "Data source"}</b>{d.notes ? ` — ${d.notes}` : ""}</p>)}
        {!item.tools?.length && !item.dataSources?.length && <VisualPlaceholder type="chart" label="Tools and data details" />}
      </section>
      <section id="answer">
        <p className="eyebrow">HUMAN REVIEW</p>
        <h2>AI assistance and professional judgment.</h2>
        {item.aiAssistance && <p><b>AI assistance:</b> {item.aiAssistance}</p>}
        {item.humanJudgment && <p><b>Human judgment:</b> {item.humanJudgment}</p>}
      </section>
      <section id="methods" className="methods-box">
        <p className="eyebrow">BEHIND THE INQUIRY</p>
        <h2>Limitations and reproducibility</h2>
        <p>{item.limitations || "Methodology and limitations will be documented here."}</p>
      </section>
    </ArticleShell>
  );
}
