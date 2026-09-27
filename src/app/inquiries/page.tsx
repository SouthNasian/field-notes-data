import { CmsContentCard } from "@/components/CmsContentCard";
import { sanityFetch } from "@/sanity/lib/fetch";
import { INQUIRIES_QUERY } from "@/sanity/lib/queries";

export const metadata = { title: "Inquiries" };

type Inquiry = {
  _id:string; title:string; subtitle?:string|null; slug:string;
  publishedAt?:string|null; logNumber?:number|null; featured?:boolean|null;
  categories?:string[]|null; tags?:string[]|null;
};

export default async function InquiriesPage() {
  const inquiries = await sanityFetch<Inquiry[]>({query: INQUIRIES_QUERY});
  return (
    <main className="shell page">
      <header className="page-header">
        <p className="eyebrow">INQUIRIES</p>
        <h1>Questions worth investigating.</h1>
        <p>Explored through data, AI, visualization, and a willingness to follow the interesting parts.</p>
      </header>
      <div className="filters">
        {["All", "Business", "Travel", "Grappling", "Hunting", "Dogs", "Visualization"].map(x => <button key={x}>{x}</button>)}
      </div>
      {inquiries.length ? (
        <div className="archive-grid">{inquiries.map(item => <CmsContentCard key={item._id} item={item} />)}</div>
      ) : (
        <div className="methods-box"><p>No published Inquiries yet. Create one in Sanity Studio and publish it.</p></div>
      )}
    </main>
  );
}
