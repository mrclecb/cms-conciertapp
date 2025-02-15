import type { CollectionConfig } from 'payload'

export const Concerts: CollectionConfig = {
  slug: 'concerts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Optional. Only if the event spans multiple days',
      },
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      required: true,
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ticketsLink',
      type: 'text',
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'venueMaps',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'additionalInfo',
      type: 'group',
      fields: [
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}
