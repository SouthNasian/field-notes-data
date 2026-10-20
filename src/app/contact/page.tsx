export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Field Notes & Data to discuss data visualization, business intelligence, AI-assisted analytics, and professional opportunities.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="shell page contact-page">
      <header className="page-header">
        <p className="eyebrow">CONTACT</p>
        <h1>Have an inquiry?</h1>
        <p>
          Whether it involves analytics, visualization, AI, or an interesting
          dataset, I'd be glad to hear from you.
        </p>
      </header>
      <form
        className="contact-form"
        action="https://formspree.io/f/xjyglnbk"
        method="POST"
      >
        <label>
          Name
          <input type="text" name="name" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            rows={7}
            placeholder="What are you curious about?"
            required
          />
        </label>
        <button type="submit" className="button primary">
          Send message
        </button>
        <p className="form-note">
          Your message will be sent securely through Formspree.
        </p>
      </form>
      <div style={{ marginTop: "2rem" }}>
        <p style={{ marginBottom: "0.75rem" }}>Prefer to connect professionally?</p>
        <a
          href="https://www.linkedin.com/in/nathan-chau-53275752/"
          target="_blank"
          rel="noopener noreferrer"
          className="button"
          aria-label="Connect on LinkedIn (opens in a new tab)"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem" }}
        >
          <svg
            aria-hidden="true"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
          </svg>
          Connect on LinkedIn
        </a>
      </div>
    </main>
  );
}
