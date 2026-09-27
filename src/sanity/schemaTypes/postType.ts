
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Content',
  type: 'document',

  fields: [
    defineField({
      name: 'contentType',
      title: 'Content type',
      type: 'string',
      initialValue: 'inquiry',
      options: {
        list: [
          {title: 'Inquiry', value: 'inquiry'},
          {title: 'Field Note', value: 'fieldNote'},
          {title: 'Case Study', value: 'caseStudy'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logNumber',
      title: 'Log number',
      description: 'Optional display number, e.g. 001.',
      type: 'number',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / dek',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'expedition',
      title: 'Expedition',
      type: 'reference',
      to: [{type: 'expedition'}],
    }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'blockContent',
    }),
    defineField({
      name: 'tools',
      title: 'Tools',
      description: 'Examples: ChatGPT, Tableau, Power BI, SQL, Python.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'dataSources',
      title: 'Data sources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Source name', type: 'string'}),
            defineField({name: 'url', title: 'Source URL', type: 'url'}),
            defineField({name: 'notes', title: 'Notes', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'name', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({
      name: 'aiAssistance',
      title: 'How AI assisted',
      description: 'Document where ChatGPT or other AI tools accelerated or shaped the work.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'humanJudgment',
      title: 'Human judgment / validation',
      description: 'What you verified, changed, rejected, or decided yourself.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'limitations',
      title: 'Limitations',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'businessChallenge',
      title: 'Business challenge',
      type: 'text',
      rows: 3,
      hidden: ({document}) => document?.contentType !== 'caseStudy',
    }),
    defineField({
      name: 'intendedAudience',
      title: 'Intended audience',
      type: 'string',
      hidden: ({document}) => document?.contentType !== 'caseStudy',
    }),
    defineField({
      name: 'decisionSupported',
      title: 'Decision supported',
      type: 'text',
      rows: 3,
      hidden: ({document}) => document?.contentType !== 'caseStudy',
    }),
    defineField({
      name: 'dashboardUrl',
      title: 'Dashboard / data product URL',
      type: 'url',
      hidden: ({document}) => document?.contentType !== 'caseStudy',
    }),
    defineField({
      name: 'fieldLocation',
      title: 'Field location',
      type: 'string',
      hidden: ({document}) => document?.contentType !== 'fieldNote',
    }),
    defineField({
      name: 'fieldDate',
      title: 'Field date',
      type: 'date',
      hidden: ({document}) => document?.contentType !== 'fieldNote',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      contentType: 'contentType',
      number: 'logNumber',
      media: 'heroImage',
    },
    prepare({title, contentType, number, media}) {
      const labels: Record<string, string> = {
        inquiry: 'Inquiry',
        fieldNote: 'Field Note',
        caseStudy: 'Case Study',
      }
      const label = labels[contentType] || 'Content'
      const numberLabel = number ? ` ${String(number).padStart(3, '0')}` : ''
      return {title, subtitle: `${label}${numberLabel}`, media}
    },
  },
})
