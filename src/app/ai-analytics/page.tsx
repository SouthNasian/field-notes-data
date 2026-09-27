import Link from "next/link";
import { LiveContentCard } from "@/components/LiveContentCard";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CASE_STUDIES_QUERY, INQUIRIES_QUERY } from "@/sanity/lib/queries";

export const metadata={title:"AI + Analytics"};

type Item={_id:string;title:string;subtitle?:string|null;slug:string;logNumber?:number|null;categories?:string[]|null;tags?:string[]|null};

export default async function AIAnalyticsPage(){
  const [cases,inquiries]=await Promise.all([
    sanityFetch<Item[]>({query:CASE_STUDIES_QUERY}),
    sanityFetch<Item[]>({query:INQUIRIES_QUERY})
  ]);
  const featured=cases[0];
  return <main>
    <section className="shell page-header pro-header">
      <p className="eyebrow">AI + ANALYTICS</p><h1>Turning business questions into decision-ready analytics.</h1>
      <p>Professional work focused on using ChatGPT, analytics, data modeling, and visualization without giving up human judgment or metric rigor.</p>
      <div className="tag-row"><span>Power BI</span><span>Tableau</span><span>ChatGPT</span><span>Data Visualization</span></div>
    </section>
    <section className="shell section feature-grid">
      <VisualPlaceholder type="dashboard" label="Featured professional case study"/>
      <div className="feature-copy"><p className="eyebrow">FEATURED CASE STUDY</p>
        <h2>{featured?.title || "Your first professional case study"}</h2>
        <p>{featured?.subtitle || "Publish a Case Study in Sanity Studio and it will appear here."}</p>
        {featured && <Link className="button primary" href={`/case-studies/${featured.slug}`}>View case study</Link>}
      </div>
    </section>
    <section className="professional-band"><div className="shell">
      <p className="eyebrow">HOW I USE AI</p><h2>AI accelerates the work. It does not own the judgment.</h2>
      <div className="method-flow">{["Business question","Data","AI exploration","Validation","Analysis","Visualization"].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div>
    </div></section>
    <section className="section shell"><div className="section-head"><div><p className="eyebrow">SELECTED INQUIRIES</p><h2>Other analytical work</h2></div></div>
      <div className="archive-grid">{inquiries.slice(0,2).map(i=><LiveContentCard key={i._id} item={{...i,contentType:"inquiry"}}/>)}</div>
    </section>
  </main>
}
