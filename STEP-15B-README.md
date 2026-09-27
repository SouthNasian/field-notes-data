# Step 15B — Field Notes & Data Sanity CMS

This package replaces the generic Sanity blog schema/navigation with the Field Notes & Data publishing model.

## What it changes

Studio navigation:
- Inquiries
- Field Notes
- Case Studies
- Expeditions
- Categories

Inquiry, Field Note, and Case Study share the underlying `post` document type. This keeps homepage/latest-log/related-content queries simple while giving each publishing workflow its own Studio list.

## Install

From your `field-notes-data` project folder:

1. Stop the dev server with Ctrl+C.
2. Back up the project folder.
3. Copy the contents of this package into `field-notes-data`, allowing Windows to replace files when asked.
4. Delete these obsolete schema files if they still exist:
   - `src/sanity/schemaTypes/authorType.ts`
   - `src/sanity/schemaTypes/category.ts`
   - `src/sanity/schemaTypes/expedition.ts`
   - `src/sanity/schemaTypes/post.ts`
5. Keep these files:
   - `src/sanity/schemaTypes/blockContentType.ts`
   - the new `categoryType.ts`
   - the new `expeditionType.ts`
   - the new `postType.ts`
   - the new `index.ts`
6. Run:
   `npm.cmd run dev`
7. Open:
   `http://localhost:3000/studio`

## Expected Studio navigation

FIELD NOTES & DATA
- Inquiries
- Field Notes
- Case Studies
- Expeditions
- Categories

## Important

Do not delete `.env.local`. This package does not contain or replace it.

This Step 15B package changes the CMS schema and Studio organization only. The public website still reads its sample content. Connecting live Sanity queries is Step 15C.
