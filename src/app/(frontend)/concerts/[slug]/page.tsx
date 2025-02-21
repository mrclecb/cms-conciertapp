// app/concerts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { Artist, Concert } from '@/payload-types'
import ConcertView from './view'
import { formatDate } from '@/app/lib/utils'

const payload = await getPayload({ config: configPromise });

export async function generateStaticParams() {
  const concerts = await payload.find({
    collection: 'concerts',
    limit: 1000,
  });

  return concerts.docs.map((concert) => ({
    slug: concert.slug,
  }));
}

async function getSetlist(artistId: string) {
  const setlist = await payload.find({
    collection: 'setlists',
    where: {
      artist: {
        equals: artistId,
      },
    },
    depth: 2,
  })
  return setlist
}

async function getConcertBySlug(slug: string): Promise<Concert | null> {
  const concerts = await payload.find({
    collection: 'concerts',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    populate: {
      artists: {
        name: true,
        profileImage: true,
        externalProfileURL: true,
      },
      venues: {
        name: true,
        images: true,
        address: true,
        capacity: true,
      },
      tags: {
        name: true,
      },
    },
  });

  return concerts.docs[0] || null;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const concert = await getConcertBySlug(slug)

  if (!concert) {
    return {
      title: 'Concierto no encontrado',
    }
  }

  return {
    title: concert.seo?.metaTitle,
    description: concert.seo?.metaDescription,
    keywords: concert.seo?.keywords?.map((keyword) => keyword.keyword).join(', ') || '',
    openGraph: {
      title: concert.title,
      description: concert.seo?.metaDescription || '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/${slug}`,
      images: concert.seo?.ogImage && typeof concert.seo.ogImage !== 'string' && concert.seo.ogImage.url ? [
        concert.seo.ogImage.url
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: concert.title,
      description: concert.seo?.metaDescription || '',
      images: [typeof concert.poster === 'string' ? concert.poster : concert.poster?.url || ''],
    }
  }
}

export default async function ConcertPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const {slug} = await params;
  const concert = await getConcertBySlug(slug);

  if (!concert) {
    notFound();
  }

  // Get setlists for each artist and enhance the concert object
  const enhancedArtists = await Promise.all(
    (concert.artists || []).map(async (value: string | Artist) => {
      if (typeof value === 'string') {
        return value; // Keep as string if it's a string
      }
      const setlistData = await getSetlist(value.id)
      return {
        ...value,
        setlist: setlistData.docs[0] || null,
      } as Artist // Assert as Artist type
    }),
  )

  
  concert.artists = enhancedArtists as (string | Artist)[]

  const formattedDate = formatDate(concert.startDate);

  return <div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Event',
                  name: concert.title,
                  startDate: concert.startDate,
                  endDate: concert.endDate || concert.startDate,
                  image: typeof concert.poster === 'string' ? concert.poster : concert.poster?.url,
                  performer: concert.artists?.map((artist: string | Artist) => ({
                    '@type': 'PerformingGroup',
                    name: typeof artist === 'string' ? artist : artist.name,
                  })),
                  location: {
                    '@type': 'Place', 
                    name: typeof concert.venue === 'string' ? concert.venue : concert.venue?.name,
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: typeof concert.venue === 'string' ? '' : concert.venue?.address,
                    },
                  },
                  offers: concert.ticketsLink
                    ? {
                        '@type': 'Offer',
                        url: concert.ticketsLink,
                        availability: 'https://schema.org/InStock',
                      }
                    : undefined,
                }),
              }}
            />
      <ConcertView concert={concert} formattedDate={formattedDate} />
    </div>;
}