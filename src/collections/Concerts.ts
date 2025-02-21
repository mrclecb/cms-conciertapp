import type { CollectionConfig } from 'payload'

export const Concerts: CollectionConfig = {
  slug: 'concerts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
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
    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Configuración SEO para este concierto',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Título optimizado para SEO (55-60 caracteres)',
          },
          validate: (value: string | null | undefined) => {
            if (value && value.length > 60) return 'El meta título debe tener 60 caracteres o menos';
            return true;
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Descripción optimizada para SEO (150-160 caracteres)',
          },
          validate: (value) => {
            if (value && value.length > 160) return 'La meta descripción debe tener 160 caracteres o menos';
            return true;
          },
        },
        {
          name: 'keywords',
          type: 'array',
          admin: {
            description: 'Palabras clave relevantes para este concierto',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Imagen para compartir en redes sociales (1200x630px recomendado)',
          },
        },
        {
          name: 'structuredData',
          type: 'group',
          admin: {
            description: 'Datos estructurados para eventos (Schema.org)',
          },
          fields: [
            {
              name: 'performerType',
              type: 'select',
              options: [
                {
                  label: 'Persona',
                  value: 'Person',
                },
                {
                  label: 'Grupo musical',
                  value: 'MusicGroup',
                },
                {
                  label: 'Organización',
                  value: 'Organization',
                },
              ],
              defaultValue: 'MusicGroup',
            },
            {
              name: 'eventStatus',
              type: 'select',
              options: [
                {
                  label: 'Programado',
                  value: 'EventScheduled',
                },
                {
                  label: 'Pospuesto',
                  value: 'EventPostponed',
                },
                {
                  label: 'Reprogramado',
                  value: 'EventRescheduled',
                },
                {
                  label: 'Cancelado',
                  value: 'EventCancelled',
                },
              ],
              defaultValue: 'EventScheduled',
            },
            {
              name: 'priceRange',
              type: 'text',
              admin: {
                description: 'Ej: "$20 - $100"',
              },
            },
            {
              name: 'availability',
              type: 'select',
              options: [
                {
                  label: 'Disponible',
                  value: 'InStock',
                },
                {
                  label: 'Pocas entradas',
                  value: 'LimitedAvailability',
                },
                {
                  label: 'Agotado',
                  value: 'SoldOut',
                },
                {
                  label: 'Preventas',
                  value: 'PreSale',
                },
              ],
              defaultValue: 'InStock',
            },
          ],
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          admin: {
            description: 'URL canónica si es diferente a la URL por defecto',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          admin: {
            description: 'Marcar para evitar que este concierto sea indexado por buscadores',
          },
          defaultValue: false,
        },
      ],
    },
    // Tracking y Analytics
    {
      name: 'trackingInfo',
      type: 'group',
      admin: {
        description: 'Información para tracking y analytics',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'eventCategory',
          type: 'select',
          options: [
            {
              label: 'Concierto',
              value: 'concert',
            },
            {
              label: 'Festival',
              value: 'festival',
            },
            {
              label: 'Show acústico',
              value: 'acoustic',
            },
            {
              label: 'Lanzamiento',
              value: 'release',
            },
          ],
          admin: {
            description: 'Categoría para tracking de eventos',
          },
        },
        {
          name: 'utmParameters',
          type: 'group',
          fields: [
            {
              name: 'source',
              type: 'text',
              admin: {
                description: 'UTM source por defecto para este evento',
              },
            },
            {
              name: 'medium',
              type: 'text',
              admin: {
                description: 'UTM medium por defecto para este evento',
              },
            },
            {
              name: 'campaign',
              type: 'text',
              admin: {
                description: 'UTM campaign por defecto para este evento',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Autogenerar metaTitle si no existe
        if (!data.seo?.metaTitle && data.title) {
          if (!data.seo) data.seo = {};
          data.seo.metaTitle = `${data.title} | Concierto en vivo`;
        }
        
        // Autogenerar metaDescription si no existe
        if (!data.seo?.metaDescription && data.title && data.venue) {
          if (!data.seo) data.seo = {};
          const venueTitle = typeof data.venue === 'object' ? data.venue.title : 'venue';
          const startDate = data.startDate ? new Date(data.startDate).toLocaleDateString() : '';
          data.seo.metaDescription = `No te pierdas ${data.title} en ${venueTitle} el ${startDate}. Compra tus entradas ahora y vive una experiencia musical inolvidable.`;
        }
        
        return data;
      },
    ],
  },
}