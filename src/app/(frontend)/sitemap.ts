import { MetadataRoute } from 'next';
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Concert } from '@/payload-types';

const payload = await getPayload({ config: configPromise })

export default async function sitemap() {
    // Obtener los productos dentro de este rango
    const docs = await payload.find({
        collection: 'concerts',
        limit: 1000
    });
  
    // Mapear los productos a las entradas del sitemap
    return docs.docs.map((concert: Concert) => ({
      url: `https://conciert.app/concerts/${concert.slug || concert.id}`,
      lastModified: concert.updatedAt,
    }));
}