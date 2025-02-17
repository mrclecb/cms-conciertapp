// src/app/(payload)/api/update-concert-slugs/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'

const payload = await getPayload({ config: configPromise })

function generateSlug(title: string, venueName: string): string {
  // Normalize strings: lowercase and remove special characters
  const normalizedTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

  const normalizedVenue = venueName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

  return `${normalizedTitle}-en-${normalizedVenue}`
}

export async function POST(request: Request) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access',
        },
        { status: 401 },
      )
    }
    // Get concerts without slugs or with empty slugs
    const concerts = await payload.find({
      collection: 'concerts',
      limit: 1000,
      where: {
        or: [
          {
            slug: {
              exists: false,
            },
          },
          {
            slug: {
              equals: '',
            },
          },
        ],
      },
      depth: 2, // To get the complete venue information
    })

    const results = []

    // Process each concert
    for (const concert of concerts.docs) {
      try {
        // Get the venue name
        const venueName = typeof concert.venue === 'object' ? concert.venue.name : ''

        if (!venueName) {
          throw new Error('Venue information not available')
        }

        // Generate the new slug
        const newSlug = generateSlug(concert.title, venueName)

        // Update the concert with the new slug
        await payload.update({
          collection: 'concerts',
          id: concert.id,
          data: {
            slug: newSlug,
          },
        })

        results.push({
          concertId: concert.id,
          title: concert.title,
          oldSlug: concert.slug,
          newSlug,
          status: 'success',
        })
      } catch (error) {
        results.push({
          concertId: concert.id,
          title: concert.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: concerts.docs.length,
      results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
