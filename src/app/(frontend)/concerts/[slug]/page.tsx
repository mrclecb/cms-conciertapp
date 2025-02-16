// app/concerts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CalendarDays, MapPin, Music, Heart, Ticket, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Media, Venue } from '@/payload-types'
import { patchDate } from '@/lib/utils'
import FadeImage from '@/app/components/ui/fade-image'

const payload = await getPayload({ config: configPromise })

// Generate static params for all concerts
export async function generateStaticParams() {
  const concerts = await payload.find({
    collection: 'concerts',
    limit: 1000,
  })

  return concerts.docs.map((concert) => ({
    slug: concert.slug,
  }))
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

// Get concert by slug
async function getConcertBySlug(slug: string) {
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
  })

  return concerts.docs[0]
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

  const artistNames = concert.artists?.map((artist: any) => artist.name).join(', ')
  const venueName = typeof concert.venue === 'string' ? concert.venue : concert.venue?.name
  const formattedDate = new Date(concert?.startDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const description = `Concierto de ${artistNames} en ${venueName} el ${formattedDate}.`

  return {
    title: `${concert.title} | Conciertos`,
    description,
    keywords: [
      ...(concert.artists?.map((artist: any) => artist.name) || []),
      venueName,
      'concierto',
      'música en vivo',
      ...(concert.tags?.map((tag: any) => tag.name) || []),
    ].join(', '),
    openGraph: {
      title: concert.title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/${slug}`,
      images: [
        {
          url: typeof concert.poster === 'string' ? concert.poster : concert.poster?.url || '',
          width: 800,
          height: 600,
          alt: concert.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: concert.title,
      description,
      images: [typeof concert.poster === 'string' ? concert.poster : concert.poster?.url || ''],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/${slug}`,
    },
  }
}

export default async function ConcertPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concert = await getConcertBySlug(slug)

  if (!concert) {
    notFound()
  }
   // Helper function to get image URL
   const getPosterUrl = (poster: string | Media): string => {
    if (typeof poster === 'string') {
      return poster;
    }
    return poster.url || '';
  };

  // Helper function to get venue name
  const getVenueName = (venue: string | Venue): string => {
    if (typeof venue === 'string') {
      return venue;
    }
    return venue.name;
  };

  // Helper function to get venue address
  const getVenueAddress = (venue: string | Venue): string => {
    if (typeof venue === 'string') {
      return '';
    }
    return venue.address || '';
  };

  // Helper function to get venue image
  const getVenueImageUrl = (venue: string | Venue): string => {
    if (typeof venue === 'string') {
      return '';
    }
    if (typeof venue.images?.[0]?.image === 'string') {
      return '';
    }

    return venue.images?.[0]?.image?.url || '';
  };

  // Get setlists for each artist and enhance the concert object
  const enhancedArtists = await Promise.all(
    (concert.artists || []).map(async (artist: any) => {
      const setlistData = await getSetlist(artist.id)
      return {
        ...artist,
        setlist: setlistData.docs[0] || null,
      }
    }),
  )

  concert.artists = enhancedArtists

  const formattedDate = patchDate(concert?.startDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav
        className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
        aria-label="Breadcrumb"
      >
        <Link href="#" className="hover:text-foreground transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <Link href="/" className="hover:text-foreground transition-colors">
          Conciertos
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="text-foreground" aria-current="page">
          {concert.title}
        </span>
      </nav>

      {/* Schema.org Event markup */}
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
            performer: concert.artists?.map((artist: any) => ({
              '@type': 'PerformingGroup',
              name: artist.name,
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

      {/* Rest of your existing component code... */}
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold">{concert.title}</h1>
          <div className="flex gap-2">
            {concert?.ticketsLink && (
              <a
                href={concert?.ticketsLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-full transition-colors"
              >
                <Ticket className="w-5 h-5" />
              </a>
            )}
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{getVenueAddress(concert.venue)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Column - Map & Venue Info */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-lg bg-muted">
                {concert.poster && (
                  <FadeImage
                    src={getPosterUrl(concert.poster)}
                    alt={concert.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {concert?.venue && (
            <Card>
              <CardHeader className="p-0">
                <FadeImage
                  src={getVenueImageUrl(concert.venue)}
                  alt={getVenueName(concert.venue)}
                  width={800}
                  height={600}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="text-2xl mb-4">
                  {getVenueName(concert.venue)}
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {getVenueAddress(concert.venue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-6">
                {concert.artists?.map((artist: any) => (
                  <div
                    key={artist.id}
                    className="flex flex-col items-center text-center p-2 rounded-lg bg-card"
                  >
                    <div className="w-12 h-12 bg-muted rounded-full mb-4">
                      {artist.externalProfileURL && (
                        <img
                          src={artist.externalProfileURL}
                          alt={artist.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-md mb-2">{artist.name}</h3>
                      {artist.description && (
                        <p className="text-sm text-muted-foreground">{artist.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {concert.tags && concert.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {concert.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <Tabs defaultValue="setlist" className="w-full">
            <TabsList>
              {concert.schedule?.images && concert.schedule.images.length > 0 && (
                <TabsTrigger value="schedule">Horarios</TabsTrigger>
              )}
              {concert.additionalInfo?.images && concert.additionalInfo?.images.length > 0 && (
                <TabsTrigger value="info">Información</TabsTrigger>
              )}
              <TabsTrigger value="setlist">Setlist probable</TabsTrigger>
            </TabsList>

            {concert.schedule?.images && concert.schedule.images.length > 0 && (
              <TabsContent value="schedule">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4"></div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {concert.additionalInfo?.images && concert.additionalInfo?.images.length > 0 && (
              <TabsContent value="info">
                <Card>
                  <CardContent className="pt-6 prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: concert.additionalInfo || '',
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="setlist">
              <Card>
                <CardContent className="pt-6">
                  {concert.artists?.map((artist: any) => (
                    <div key={artist.id} className="mb-6 last:mb-0">
                      <h3 className="font-semibold mb-3">{artist.name}</h3>
                      {artist.setlist?.setlist ? (
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                          <ol className="space-y-2">
                            {artist.setlist.setlist.map((song: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-muted-foreground" />
                                <span>{song}</span>
                              </li>
                            ))}
                          </ol>
                        </ScrollArea>
                      ) : (
                        <p className="text-muted-foreground">Setlist no disponible</p>
                      )}
                      <Separator className="my-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
