import Link from "next/link";
import {LiveContentCard,type LiveItem} from "@/components/LiveContentCard";
import {VisualPlaceholder} from "@/components/VisualPlaceholder";
import {sanityFetch} from "@/sanity/lib/fetch";
import {CASE_STUDIES_QUERY,EXPEDITIONS_QUERY,FEATURED_INQUIRY_QUERY,FIELD_NOTES_QUERY,INQUIRIES_QUERY,LATEST_LOG_QUERY} from "@/sanity/lib/queries";

type Item=LiveItem&{_id:string;subtitle?:string|null;publishedAt?:string|null};
type Expedition={_id:string;title:string;slug:string;status?:string|null};
const href=(x:Item)=>x.contentType==="fieldNote"?`/field-notes/${x.slug}`:x.contentType==="caseStudy"?`/case-studies/${x.slug}`:`/inquiries/${x.slug}`;
const kind=(x:Item)=>x.contentType==="fieldNote"?"Field Note":x.contentType==="caseStudy"?"Case Study":"Inquiry";
const date=(v?:string|null)=>v?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(v)):"";

export default async function Home(){
 const [featured,inquiries,fieldNotes,cases,expeditions,latest]=await Promise.all([
  sanityFetch<Item|null>({query:FEATURED_INQUIRY_QUERY}),sanityFetch<Item[]>({query:INQUIRIES_QUERY}),
  sanityFetch<Item[]>({query:FIELD_NOTES_QUERY}),sanityFetch<Item[]>({query:CASE_STUDIES_QUERY}),
  sanityFetch<Expedition[]>({query:EXPEDITIONS_QUERY}),sanityFetch<Item[]>({query:LATEST_LOG_QUERY})
 ]);
 const hero=featured||inquiries[0];const caseStudy=cases[0];
 return <main>
  <section className="hero shell"><div className="hero-grid"><div><p className="eyebrow">DIGITAL EXPEDITION LOG · EST. 2026</p><h1>Field Notes <span>&amp;</span> Data</h1><p className="tagline">Curious inquiries. Real data. AI-assisted answers.</p><p className="hero-copy">Exploring business, sport, travel, the outdoors, and everyday questions through data, AI, visualization, and observation.</p><div className="actions"><Link className="button primary" href="/inquiries">Explore inquiries</Link><Link className="button ghost" href="/ai-analytics">AI + Analytics →</Link></div></div><div className="hero-map"><div className="coordinate">35.7° N / 78.8° W</div><VisualPlaceholder type="map" label="A map for whatever comes next"/></div></div></section>
  <section className="section shell"><div className="section-head"><div><p className="eyebrow">FEATURED INQUIRY</p><h2>One question worth following farther</h2></div><span>LOG / {hero?.logNumber?String(hero.logNumber).padStart(3,"0"):"—"}</span></div>
   <div className="feature-grid"><VisualPlaceholder type="map" label="Featured inquiry"/><div className="feature-copy"><p className="eyebrow">INQUIRY · {hero?.categories?.[0]||"DATA"}</p><h2>{hero?.title||"Publish a featured Inquiry in Sanity"}</h2><p>{hero?.subtitle||"Mark an Inquiry as featured to place it here."}</p>{hero&&<Link className="text-link" href={`/inquiries/${hero.slug}`}>Explore the inquiry →</Link>}</div></div>
  </section>
  <section className="section shell split-editorial"><div><div className="section-head"><div><p className="eyebrow">FROM THE DATA</p><h2>Things I investigated</h2></div><Link href="/inquiries">All inquiries →</Link></div><div className="stack">{inquiries.filter(x=>x.slug!==hero?.slug).slice(0,2).map(i=><LiveContentCard key={i._id} item={{...i,contentType:"inquiry"}} compact/>)}</div></div>
   <div><div className="section-head"><div><p className="eyebrow">FROM THE FIELD</p><h2>Things I stopped to notice</h2></div><Link href="/field-notes">Field notes →</Link></div><div className="stack">{fieldNotes.slice(0,2).map(i=><LiveContentCard key={i._id} item={{...i,contentType:"fieldNote"}} compact/>)}</div></div>
  </section>
  <section className="professional-band"><div className="shell"><div className="section-head light"><div><p className="eyebrow">AI + ANALYTICS</p><h2>Professional case studies</h2></div><Link href="/ai-analytics">Explore professional work →</Link></div><div className="case-feature"><VisualPlaceholder type="dashboard" label="Case study dashboard"/><div><p className="eyebrow">CASE STUDY</p><h2>{caseStudy?.title||"Publish your first Case Study"}</h2><p>{caseStudy?.subtitle||"Professional analytics work will appear here."}</p>{caseStudy&&<Link className="button light-button" href={`/case-studies/${caseStudy.slug}`}>View case study</Link>}</div></div></div></section>
  <section className="section shell"><div className="section-head"><div><p className="eyebrow">CURRENT EXPEDITIONS</p><h2>Questions that may take more than one post</h2></div></div><div className="expedition-grid">{expeditions.slice(0,3).map((x,idx)=><Link className="expedition" href={`/expeditions/${x.slug}`} key={x._id}><span>{String(idx+1).padStart(2,"0")}</span><h3>{x.title}</h3><p>{x.status||"Ongoing"} collection →</p></Link>)}</div></section>
  <section className="method-band"><div className="shell"><p className="eyebrow">THE METHOD</p><h2>Curiosity is the starting point.</h2><div className="method-flow">{["Question","Data","AI","Analysis","Visualization","Insight"].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div></div></section>
  <section className="section shell about-teaser"><div><p className="eyebrow">ABOUT FIELD NOTES &amp; DATA</p><h2>A place to investigate things professionally—and notice things personally.</h2></div><div><p>The site is designed as both an AI/data visualization portfolio and a personal publication. Inquiries use data to explore questions. Field Notes capture experiences worth reflecting on.</p><Link className="text-link" href="/about">More about the project →</Link></div></section>
  <section className="section shell"><div className="section-head"><div><p className="eyebrow">LATEST LOG</p><h2>Recent entries</h2></div></div><div className="latest-list">{latest.slice(0,5).map((x,i)=><Link className="latest-row" href={href(x)} key={x._id}><span>{String(i+1).padStart(2,"0")}</span><b>{kind(x)}</b><p>{x.title}</p><small>{date(x.publishedAt)}</small></Link>)}</div></section>
 </main>
}
