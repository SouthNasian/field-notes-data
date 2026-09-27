// Rename to sanity.config.ts after running `npx sanity@latest init`
// and replace environment placeholders with your real Sanity project.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Field Notes & Data",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replace-me",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
