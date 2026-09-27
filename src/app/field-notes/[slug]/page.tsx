import {notFound} from "next/navigation";
import {ArticleShell} from "@/components/ArticleShell";
import {PortableArticle} from "@/sanity/components/PortableArticle";
import {sanityFetch} from "@/sanity/lib/fetch";
import {FIELD_NOTE_QUERY} from "@/sanity/lib/queries";
import type {PortableTextBlock} from "@portabletext/types";

type Item={title:string;subtitle?:string|null;publishedAt?:string|null;fieldDate?:string|null;fieldLocation?:string|null;logNumber?:number|null;categories?:string[]|null;body?:PortableTextBlock[];humanJudgment?:string|null;limitations?:string|null};
const date=(v?:string|null)=>v?new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(v)):"DATE NOT SET";

export default async function FieldNotePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const item=await sanityFetch<Item|null>({query:FIELD_NOTE_QUERY,params:{slug}});if(!item)notFound();
 const number=item.logNumber?String(item.logNumber).padStart(3,"0"):"—";
 return <ArticleShell type="Field Note" number={number} eyebrow={item.categories?.[0]||"FROM THE FIELD"} title={item.title} dek={item.subtitle||""} date={date(item.fieldDate||item.publishedAt)} visual="photo">
  <section id="opening"><p className="eyebrow">THE MOMENT</p><PortableArticle value={item.body}/></section>
  <section id="middle"><p className="eyebrow">THE OBSERVATION</p><h2>What stood out?</h2><p>{item.humanJudgment||"Add the observation or reflection in Sanity."}</p></section>
  <section id="methods" className="methods-box"><p className="eyebrow">FIELD DETAILS</p><h2>Context without clutter.</h2><p>{item.fieldLocation||"Location not specified"} · {date(item.fieldDate||item.publishedAt)}</p>{item.limitations&&<p>{item.limitations}</p>}</section>
 </ArticleShell>
}
