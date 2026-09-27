
import {defineField, defineType} from 'sanity'

export const expeditionType = defineType({
  name: 'expedition',
  title: 'Expedition',
  type: 'document',

  fields: [
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
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 4}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'ongoing',
      options: {
        list: [
          {title: 'Ongoing', value: 'ongoing'},
          {title: 'Complete', value: 'complete'},
          {title: 'Paused', value: 'paused'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
})
