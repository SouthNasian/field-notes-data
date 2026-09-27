import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">FIELD NOTES &amp; DATA</p>
          <p>Curious inquiries. Real data. AI-assisted answers.</p>
        </div>
        <div className="footer-links">
          <Link href="/inquiries">Inquiries</Link>
          <Link href="/ai-analytics">AI + Analytics</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
