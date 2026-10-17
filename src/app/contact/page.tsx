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
    </main>
  );
}
