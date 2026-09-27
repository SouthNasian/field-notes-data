import type {StructureResolver} from 'sanity/structure'

const contentList = (
  S: Parameters<StructureResolver>[0],
  title: string,
  contentType: string,
) =>
  S.documentList()
    .title(title)
    .filter('_type == "post" && contentType == $contentType')
    .params({contentType})

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Field Notes & Data')
    .items([
      S.listItem()
        .title('Inquiries')
        .child(contentList(S, 'Inquiries', 'inquiry')),

      S.listItem()
        .title('Field Notes')
        .child(contentList(S, 'Field Notes', 'fieldNote')),

      S.listItem()
        .title('Case Studies')
        .child(contentList(S, 'Case Studies', 'caseStudy')),

      S.divider(),

      S.documentTypeListItem('expedition')
        .title('Expeditions'),

      S.documentTypeListItem('category')
        .title('Categories'),
    ])