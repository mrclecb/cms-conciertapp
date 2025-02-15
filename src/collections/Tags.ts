import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mostrar este tag en los filtros de conciertos',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Orden de aparición (menor número = aparece primero)',
      },
    }
  ]
}
