export const postType = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule: any) => Rule.required() },
    { name: "contentType", title: "Content type", type: "string", options: { list: [
      { title: "Inquiry", value: "inquiry" },
      { title: "Field Note", value: "fieldNote" }
    ], layout: "radio" }, validation: (Rule: any) => Rule.required() },
    { name: "inquiryNumber", title: "Log number", type: "number" },
    { name: "subtitle", title: "Subtitle / dek", type: "text", rows: 3 },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    { name: "heroImage", title: "Hero image", type: "image", options: { hotspot: true } },
    { name: "categories", title: "Categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } },
    { name: "expedition", title: "Expedition", type: "reference", to: [{ type: "expedition" }] },
    { name: "isCaseStudy", title: "Feature as professional case study", type: "boolean", initialValue: false },
    { name: "featured", title: "Feature on homepage", type: "boolean", initialValue: false },
    { name: "body", title: "Body", type: "array", of: [
      { type: "block" },
      { type: "image", options: { hotspot: true }, fields: [{ name: "caption", type: "string", title: "Caption" }] }
    ]},
    { name: "tools", title: "Tools", type: "array", of: [{ type: "string" }], options: { layout: "tags" } },
    { name: "dataSources", title: "Data sources", type: "array", of: [{ type: "string" }] },
    { name: "aiAssistance", title: "How AI assisted", type: "text", rows: 5 },
    { name: "limitations", title: "Limitations", type: "text", rows: 5 }
  ],
  preview: {
    select: { title: "title", subtitle: "contentType", media: "heroImage" }
  }
};
