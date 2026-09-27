import Link from "next/link";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="shell page">
      <header className="about-grid">
        <VisualPlaceholder type="photo" label="Portrait or field photograph" />
        <div><p className="eyebrow">ABOUT</p><h1>Data visualization developer. Curious person.</h1><p className="lead">I specialize in turning questions into clear analytical experiences using data visualization, business intelligence, and AI-assisted workflows.</p></div>
      </header>
      <section className="article-layout no-aside"><article className="prose">
        <h2>What I do</h2><p>My professional work centers on dashboard development, analytical storytelling, and making complex information easier to understand. Field Notes &amp; Data is where I document experiments in using ChatGPT alongside those skills.</p>
        <h2>Why Field Notes &amp; Data</h2><p>Not everything worth exploring begins as a business problem. The same curiosity that drives an analytics project can show up while traveling, training, competing, or spending time outdoors. This site gives both kinds of work a home.</p>
        <h2>Away from the data</h2><p>Expect Field Notes about grappling, upland hunting, dog training, travel, and whatever else proves interesting enough to document.</p>
        <Link className="button primary" href="/contact">Get in touch</Link>
      </article></section>
    </main>
  );
}
