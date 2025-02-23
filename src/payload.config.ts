// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Concerts } from './collections/Concerts'
import { Tags } from './collections/Tags'
import { Venues } from './collections/Venues'
import { Artists } from './collections/Artists'
import { Setlists } from './collections/Setlists'
import { ThirdPartyAccess } from './collections/ThirdPartyAccess'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Artists, Tags, Venues, Concerts, Setlists, ThirdPartyAccess],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  plugins: [
    // storage-adapter-placeholder
  ],
})
