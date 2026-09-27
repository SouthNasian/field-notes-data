export const categoryType = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "description", title: "Description", type: "text", rows: 3 }
  ]
};
