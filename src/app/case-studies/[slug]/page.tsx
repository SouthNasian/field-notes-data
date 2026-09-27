import {notFound} from "next/navigation";
import {ArticleShell} from "@/components/ArticleShell";
import {VisualPlaceholder} from "@/components/VisualPlaceholder";
import {PortableArticle} from "@/sanity/components/PortableArticle";
import {sanityFetch} from "@/sanity/lib/fetch";
import {CASE_STUDY_QUERY} from "@/sanity/lib/queries";
import type {PortableTextBlock} from "@portabletext/types";

type Item={title:string;subtitle?:string|null;slug:string;publishedAt?:string|null;logNumber?:number|null;body?:PortableTextBlock[];businessChallenge?:string|null;intendedAudience?:string|null;decisionSupported?:string|null;dashboardUrl?:string|null;tools?:string[]|null;dataSources?:{name?:string;url?:string;notes?:string}[]|null;aiAssistance?:string|null;humanJudgment?:string|null;limitations?:string|null;categories?:string[]|null};

const date=(v?:string|null)=>v?new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(v)):"DATE NOT SET";

export default async function CaseStudyPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const item=await sanityFetch<Item|null>({query:CASE_STUDY_QUERY,params:{slug}}); if(!item)notFound();
 const number=item.logNumber?String(item.logNumber).padStart(3,"0"):"—";
 return <ArticleShell type="Case Study" number={number} eyebrow={item.categories?.[0]||"AI + ANALYTICS"} title={item.title} dek={item.subtitle||""} date={date(item.publishedAt)} visual="dashboard">
  <section id="opening"><p className="eyebrow">MISSION BRIEF</p><h2>Executive summary first.</h2><div className="brief-grid">
   <div><b>Challenge</b><span>{item.businessChallenge||"Not specified"}</span></div><div><b>Audience</b><span>{item.intendedAudience||"Not specified"}</span></div>
   <div><b>Decision</b><span>{item.decisionSupported||"Not specified"}</span></div><div><b>Tools</b><span>{item.tools?.join(" · ")||"Not specified"}</span></div>
  </div></section>
  <section><p className="eyebrow">THE DATA PRODUCT</p><h2>Give decision-makers the useful artifact early.</h2><VisualPlaceholder type="dashboard" label="Interactive dashboard or product embed"/>{item.dashboardUrl&&<p><a className="text-link" href={item.dashboardUrl}>Open data product →</a></p>}</section>
  <section id="middle"><p className="eyebrow">TECHNICAL FIELD LOG</p><h2>Then let technical reviewers go deeper.</h2><PortableArticle value={item.body}/></section>
  <section><p className="eyebrow">AI WORKFLOW</p><h2>Prompt → output → validation → revision.</h2><p>{item.aiAssistance||"Document how AI assisted the work here."}</p></section>
  <section id="answer"><p className="eyebrow">HUMAN REVIEW</p><h2>What required judgment?</h2><p>{item.humanJudgment||"Document validation and professional judgment here."}</p></section>
  <section id="methods" className="methods-box"><p className="eyebrow">REPRODUCIBILITY</p><h2>Dataset · Tools · Prompts · Code</h2>
   {item.dataSources?.map((d,i)=><p key={i}><b>{d.name||"Data source"}</b>{d.notes?` — ${d.notes}`:""}</p>)}<p>{item.limitations||"Add limitations and reproducibility notes in Sanity."}</p>
  </section>
 </ArticleShell>
}
