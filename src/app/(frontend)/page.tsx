import { Suspense } from 'react'
import { ConcertCard } from '../components/concerts/concert-card'
import { ConcertCardSkeleton } from '../components/concerts/concert-card-skeleton'
import { ConcertFilters } from '../components/concerts/concert-filters'
import { PaginationControls } from '../components/ui/pagination-control'
import { CollectionSlug, getPayload } from 'payload'
import { Metadata } from 'next'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Conciertapp | Descubre los mejores conciertos en Chile',
  description: 'Encuentra y explora todos los conciertos y eventos musicales en Chile. Mantente al día con las fechas, artistas y venues más importantes del país.',
  openGraph: {
    title: 'Conciertapp | Descubre los mejores conciertos en Chile',
    description: 'Encuentra y explora todos los conciertos y eventos musicales en Chile. Mantente al día con las fechas, artistas y venues más importantes del país.',
    type: 'website',
    locale: 'es-CL',
    siteName: 'Conciertapp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conciertapp | Conciertos en Chile',
    description: 'Descubre todos los conciertos y eventos musicales en Chile',
  },
  keywords: 'conciertos chile, eventos musicales chile, tickets conciertos, agenda musical chile, shows en vivo, entradas conciertos',
  alternates: {
    canonical: 'https://conciert.app',
  },
  robots: {
    index: true,
    follow: true,
  },
}

function ConcertSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(12)].map((_, index) => (
        <ConcertCardSkeleton key={index} />
      ))}
    </div>
  )
}

const payload = await getPayload({ config: configPromise })

const ITEMS_PER_PAGE = 12

async function ConcertList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { search, dateFrom, dateTo, tag, sort, page = '1' } = await searchParams
  const currentPage = Number(page)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const tomorrowISOString = tomorrow.toISOString()

  // Función auxiliar para manejar las fechas
  const getDateRange = (dateFrom: string | null, dateTo: string | null) => {
    if (dateFrom) {
      const startDate = new Date(dateFrom)
      startDate.setHours(0, 0, 0, 0)

      let endDate
      if (dateTo) {
        endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
      } else {
        // Si solo hay una fecha, usar el final del mismo día
        endDate = new Date(dateFrom)
        endDate.setHours(23, 59, 59, 999)
      }

      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }
    }

    return {
      startDate: tomorrowISOString,
      endDate: null,
    }
  }

  const { startDate, endDate } = getDateRange(
    typeof dateFrom === 'string' ? dateFrom : null,
    typeof dateTo === 'string' ? dateTo : null,
  )
  const query: {
    collection: CollectionSlug
    depth: number
    sort: string | string[]
    limit: number
    page: number
    where: {
      and: (
        | { title: { contains: string | string[] } }
        | { 'tags.id': { in: string[] } }
        | { startDate: { greater_than_equal: string | string[] } }
        | { startDate: { less_than_equal: string | string[] } }
        | {}
      )[]
    }
  } = {
    collection: 'concerts',
    depth: 2,
    sort: sort || 'startDate',
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    where: {
      and: [
        search
          ? {
              title: {
                contains: search,
              },
            }
          : {},
        tag
          ? {
              'tags.id': {
                in: typeof tag === 'string' ? tag.split(',') : tag,
              },
            }
          : {},
        // Filtro de fecha inicial
        {
          startDate: {
            greater_than_equal: startDate,
          },
        },
        // Filtro de fecha final (si existe)
        endDate
          ? {
              startDate: {
                less_than_equal: endDate,
              },
            }
          : {},
      ],
    },
  }

  const concerts = await payload.find(query)
  const totalPages = Math.ceil(concerts.totalDocs / ITEMS_PER_PAGE)

  const patchDate = (date: string) => {
    const originalDate = new Date(date);
    return new Date(originalDate.setDate(originalDate.getDate() - 1));
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concerts.docs.map((concert: any) => (
          <ConcertCard
            slug={concert.slug}
            key={concert.id}
            id={concert.id}
            title={concert.title}
            date={patchDate(concert.startDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            venue={concert.venue.name}
            artists={concert.artists}
          />
        ))}

        {concerts.docs.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No se encontraron conciertos que coincidan con los filtros seleccionados
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          totalPages={totalPages}
          currentPage={currentPage}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
        />
      )}
    </>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Obtener los tags más populares para los filtros
  const popularTagsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/popular-tags`,
    {
      next: {
        revalidate: 3600, // Revalidar cada hora
      },
    },
  )

  const popularTagsData = await popularTagsResponse.json()

  // Transformar los datos al formato que espera ConcertFilters
  const tags = popularTagsData.popularTags.map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    // Podemos pasar información adicional si queremos mostrarla en los filtros
    count: tag.count,
    percentage: tag.percentage,
  }))

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Próximos conciertos</h1>

      <Suspense fallback={<div>Cargando filtros...</div>}>
        <ConcertFilters tags={tags} />
      </Suspense>

      <Suspense fallback={<ConcertSkeletonGrid />}>
        <ConcertList searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
