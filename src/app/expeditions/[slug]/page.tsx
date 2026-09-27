import {notFound} from "next/navigation";
import {LiveContentCard,type LiveItem} from "@/components/LiveContentCard";
import {sanityFetch} from "@/sanity/lib/fetch";
import {EXPEDITION_QUERY} from "@/sanity/lib/queries";

type Expedition={title:string;summary?:string|null;status?:string|null;entries?:Array<LiveItem&{_id:string}>};

export default async function ExpeditionPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const item=await sanityFetch<Expedition|null>({query:EXPEDITION_QUERY,params:{slug}});if(!item)notFound();
 return <main className="shell page"><header className="page-header"><p className="eyebrow">EXPEDITION · COLLECTION</p><h1>{item.title}</h1><p>{item.summary||"A collection of related work."}</p></header>
  <div className="methods-box"><p className="eyebrow">STATUS</p><h2>{item.status||"Ongoing"}</h2><p>{item.entries?.length||0} published entries in this Expedition.</p></div>
  {!!item.entries?.length&&<section className="section"><div className="archive-grid">{item.entries.map(e=><LiveContentCard key={e._id} item={e}/>)}</div></section>}
 </main>
}
