import {LiveContentCard} from "@/components/LiveContentCard";
import {sanityFetch} from "@/sanity/lib/fetch";
import {FIELD_NOTES_QUERY} from "@/sanity/lib/queries";

type Item={_id:string;title:string;subtitle?:string|null;slug:string;logNumber?:number|null;categories?:string[]|null;tags?:string[]|null};

export const metadata={title:"Field Notes"};

export default async function FieldNotesPage(){
 const items=await sanityFetch<Item[]>({query:FIELD_NOTES_QUERY});
 return <main className="shell page"><header className="page-header"><p className="eyebrow">FIELD NOTES</p><h1>Things worth stopping to notice.</h1><p>Personal observations from grappling, hunting, dog training, travel, and wherever curiosity leads.</p></header>
  {items.length?<div className="archive-grid">{items.map(i=><LiveContentCard key={i._id} item={{...i,contentType:"fieldNote"}}/>)}</div>:<div className="methods-box"><p>No published Field Notes yet.</p></div>}
 </main>
}
