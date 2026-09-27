export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="shell page contact-page">
      <header className="page-header"><p className="eyebrow">CONTACT</p><h1>Have an inquiry?</h1><p>Whether it involves analytics, visualization, AI, or an interesting dataset, this is where a future contact form and professional links will live.</p></header>
      <form className="contact-form">
        <label>Name<input type="text" name="name" placeholder="Your name" /></label>
        <label>Email<input type="email" name="email" placeholder="you@example.com" /></label>
        <label>Message<textarea name="message" rows={7} placeholder="What are you curious about?" /></label>
        <button type="button" className="button primary">Send message</button>
        <p className="form-note">V1 prototype: connect this form to a form service or email endpoint before production launch.</p>
      </form>
    </main>
  );
}
