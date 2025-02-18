
import type { CollectionConfig } from 'payload'

// Colección de Artists
export const Setlists: CollectionConfig = {
  slug: 'setlists',
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
        name: 'artist',
        type: 'relationship',
        relationTo: 'artists',
        required: true,
    },
    {
        name: 'setlist',
        type: 'json',
        required: true,
    },
    {
        name: 'setlistFmId',
        type: 'text',
        required: false,
    },
    {
      name: 'setlistFmName',
      type: 'text',
      required: false,
    },
    {
      name: 'playlistId',
      type: 'text',
      required: false,
    },
    {
      name: 'playlistLinkToShare',
      type: 'text',
      required: false,
    }
  ]
}
