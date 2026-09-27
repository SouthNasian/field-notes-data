# Field Notes & Data — Website V2

**Brand:** Field Notes & Data  
**Tagline:** Curious inquiries. Real data. AI-assisted answers.  
**Visual direction:** Modern Cartographer / Digital Expedition Log  
**Stack:** Next.js + Sanity + GitHub + Vercel

This package executes Step 12 as a working V2 codebase. It intentionally ships with local sample content so you can run and critique the visual experience **before** connecting a live Sanity project.

## What is implemented

- Responsive Next.js App Router site
- Refined editorial/data design system with a generative Curiosity graphic
- Editorial Dashboard homepage
- Inquiries archive
- AI + Analytics professional landing page
- About and Contact pages
- Inquiry Data Story article template
- Field Note template
- Case Study Executive Brief + Technical Field Log template
- Expedition collection placeholder
- Sanity content schemas for Posts, Categories, and Expeditions
- Sample content for design/QA
- Mobile responsive styling

## 1. Run the V1 locally

Requirements: a current Node.js release compatible with Next.js 16.

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js, normally `http://localhost:3000`.

## 2. Connect Sanity

The V1 works without Sanity. When you are ready to create the real CMS:

```bash
npx sanity@latest init
```

Choose/create a project, use a `production` dataset, TypeScript, and an embedded Studio if desired.

Copy:

```bash
cp .env.example .env.local
```

Then enter your real project ID.

The supplied schemas live in:

```text
src/sanity/schemaTypes/
```

A starter `sanity.config.example.ts` is included. After Sanity initialization, merge these schemas into the generated configuration.

The next implementation pass should replace `src/lib/sampleContent.ts` with GROQ queries from Sanity. Keeping V1 sample-driven first is deliberate: it lets us critique the design before CMS integration complicates the feedback loop.

## 3. Before production

Still intentionally unfinished for V1:

- Connect live Sanity queries and Studio
- Replace placeholders with real images/visualizations
- Connect the contact form
- Add LinkedIn/GitHub/resume URLs
- Add search/filter behavior
- Add production SEO/social images
- Accessibility audit
- Analytics
- Domain
- GitHub repository
- Vercel deployment
- Real first Inquiry / Field Note / Case Study

## Content model

### Inquiry
A data story:
Question → data → discovery → deeper investigation → finding → methods.

### Field Note
Field Log header → Moment → Observation → Reflection → optional Lesson.

### Case Study
Executive Brief → Data Product → Technical Field Log.

### Expedition
A collection of related Inquiries and Field Notes.

## Design tokens

The core palette is defined as CSS variables in `src/app/globals.css`:
- Bone
- Charcoal
- Evergreen
- Slate
- Rust
- Pale map/grid gray

The charts and dashboards you eventually embed should stay cleaner than the surrounding editorial treatment: evergreen for primary series, rust for meaningful emphasis, gray for context.


## V2 changes (Step 14)

- Replaced the hero map with a custom generative Curiosity graphic: Observation → Data → Pattern → Insight.
- Changed “Featured Expedition” to “Featured Inquiry.”
- Reduced literal cartographic decoration while retaining the approved editorial typography, restrained palette, spacing, numbering, and hierarchy.
- Added a mobile Menu button that collapses the primary navigation on phone-sized screens.
- Preserved all approved V1 page structures and article experiences.


## V2 corrected hero (September 27, 2026)

This corrected V2 restores the original V1 hero map/cartographic visual at the user's request. It retains the approved V2 changes: **Featured Inquiry** terminology and the **mobile Menu button**. The experimental generative curiosity/heatmap hero is not included.
