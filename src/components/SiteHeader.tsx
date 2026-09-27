"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href="/" onClick={close}>
          <span className="brand-mark">FN</span>
          <span>Field Notes &amp; Data</span>
        </Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          <span>Menu</span><i aria-hidden="true" /><i aria-hidden="true" />
        </button>
        <nav id="primary-nav" className={open ? "nav-open" : ""} aria-label="Primary navigation">
          <Link href="/inquiries" onClick={close}>Inquiries</Link>
          <Link href="/ai-analytics" onClick={close}>AI + Analytics</Link>
          <Link href="/about" onClick={close}>About</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
