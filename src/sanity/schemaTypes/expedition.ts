export const expeditionType = {
  name: "expedition",
  title: "Expedition",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule: any) => Rule.required() },
    { name: "summary", title: "Summary", type: "text", rows: 4 },
    { name: "status", title: "Status", type: "string", options: { list: ["Ongoing", "Complete", "Paused"] } },
    { name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }
  ]
};
