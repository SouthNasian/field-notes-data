import {notFound} from "next/navigation";
import {LiveContentCard,type LiveItem} from "@/components/LiveContentCard";
import {sanityFetch} from "@/sanity/lib/fetch";
import {EXPEDITION_QUERY} from "@/sanity/lib/queries";
import type { Metadata } from "next";

type Expedition={title:string;summary?:string|null;status?:string|null;entries?:Array<LiveItem&{_id:string}>};


type ExpeditionMetadata = {
  title: string;
  summary?: string | null;
  slug: string;
};

type ExpeditionPageProps = {
  params: Promise<{ slug: string }>;
};


export async function generateMetadata({
  params,
}: ExpeditionPageProps): Promise<Metadata> {
  const { slug } = await params;

  const item = await sanityFetch<ExpeditionMetadata | null>({
    query: EXPEDITION_QUERY,
    params: { slug },
  });

  if (!item) {
    return {
      title: "Expedition Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    item.summary?.trim() ||
    "Explore an Expedition from Field Notes & Data, connecting observations, investigations, and insights across multiple entries.";

  const url = `/expeditions/${encodeURIComponent(slug)}`;

  return {
    title: item.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      siteName: "Field Notes & Data",
      title: `${item.title} | Field Notes & Data`,
      description,
      url,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Field Notes & Data — Digital Expedition Log",
        },
      ],
    },
  };
}

export default async function ExpeditionPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const item=await sanityFetch<Expedition|null>({query:EXPEDITION_QUERY,params:{slug}});if(!item)notFound();
 return <main className="shell page"><header className="page-header"><p className="eyebrow">EXPEDITION · COLLECTION</p><h1>{item.title}</h1><p>{item.summary||"A collection of related work."}</p></header>
  <div className="methods-box"><p className="eyebrow">STATUS</p><h2>{item.status||"Ongoing"}</h2><p>{item.entries?.length||0} published entries in this Expedition.</p></div>
  {!!item.entries?.length&&<section className="section"><div className="archive-grid">{item.entries.map(e=><LiveContentCard key={e._id} item={e}/>)}</div></section>}
 </main>
}
