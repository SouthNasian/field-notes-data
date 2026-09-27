export type ContentKind = "Inquiry" | "Field Note" | "Case Study";

export type ContentCard = {
  slug: string;
  kind: ContentKind;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  visual: "chart" | "map" | "photo" | "dashboard";
};

export const inquiries: ContentCard[] = [
  {
    slug: "where-should-a-data-professional-live",
    kind: "Inquiry",
    number: "001",
    eyebrow: "TRAVEL + DATA",
    title: "Where should a data professional live if access to the outdoors matters too?",
    summary: "A sample data story combining career opportunity, cost of living, and access to outdoor recreation.",
    tags: ["Data", "Travel", "Geospatial", "ChatGPT"],
    date: "September 2026",
    visual: "map",
  },
  {
    slug: "what-makes-a-dashboard-trustworthy",
    kind: "Inquiry",
    number: "002",
    eyebrow: "DATA VISUALIZATION",
    title: "What makes an executive dashboard trustworthy?",
    summary: "Exploring metric definitions, comparison context, visual hierarchy, and the places AI-generated dashboards often need human review.",
    tags: ["Visualization", "AI", "BI"],
    date: "September 2026",
    visual: "chart",
  },
  {
    slug: "can-match-data-explain-grappling-outcomes",
    kind: "Inquiry",
    number: "003",
    eyebrow: "GRAPPLING + DATA",
    title: "Can match data explain what drives submission grappling outcomes?",
    summary: "A placeholder for a future investigation into match structure, scoring, submissions, and competitive patterns.",
    tags: ["Grappling", "Data", "Visualization"],
    date: "Coming soon",
    visual: "chart",
  },
];

export const fieldNotes: ContentCard[] = [
  {
    slug: "consistency-in-dog-training",
    kind: "Field Note",
    number: "001",
    eyebrow: "DOG TRAINING",
    title: "What a difficult training session can teach about consistency",
    summary: "A sample Field Note showing how experience, observation, reflection, and lessons fit the publication.",
    tags: ["Dogs", "Training", "Field Note"],
    date: "September 2026",
    visual: "photo",
  },
  {
    slug: "first-morning-in-grouse-cover",
    kind: "Field Note",
    number: "002",
    eyebrow: "UPLAND HUNTING",
    title: "Learning to read unfamiliar grouse cover",
    summary: "A placeholder for a field-journal entry built around experience rather than a formal data investigation.",
    tags: ["Hunting", "Travel", "Field Note"],
    date: "Coming soon",
    visual: "photo",
  },
];

export const caseStudies: ContentCard[] = [
  {
    slug: "ai-assisted-retention-analysis",
    kind: "Case Study",
    number: "001",
    eyebrow: "AI + ANALYTICS",
    title: "Using AI-assisted analytics to investigate declining customer retention",
    summary: "A fictional employer-facing case study demonstrating the Executive Brief + Technical Field Log format.",
    tags: ["ChatGPT", "Power BI", "SQL", "Visualization"],
    date: "Sample case study",
    visual: "dashboard",
  },
];

export const latest = [...inquiries, ...fieldNotes, ...caseStudies];
