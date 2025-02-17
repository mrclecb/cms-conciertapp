// src/app/(payload)/api/update-concert-genres/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })

import { add } from 'date-fns'
import { validateApiKey } from '@/app/utils'

interface SpotifySearchResult {
  artists: {
    items: Array<{
      id: string
      name: string
      genres: string[]
      popularity: number
    }>
  }
}

async function getSpotifyToken(): Promise<string> {
  const client_id = process.env.SPOTIFY_CLIENT_ID
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

async function searchArtistGenres(artistName: string, token: string): Promise<string[]> {
  try {
    // Codificar el nombre del artista para la URL
    const encodedName = encodeURIComponent(artistName.trim())

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedName}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Error searching artist: ${response.statusText}`)
    }

    const data: SpotifySearchResult = await response.json()

    // Tomar el primer resultado que coincida mejor
    if (data.artists.items.length > 0) {
      // Ordenar por popularidad para obtener el resultado más relevante
      const sortedArtists = data.artists.items.sort((a, b) => b.popularity - a.popularity)
      return sortedArtists[0].genres
    }

    return []
  } catch (error) {
    console.error(`Error getting genres for artist ${artistName}:`, error)
    return []
  }
}

async function findOrCreateTag(genreName: string) {
  // Buscar si el tag ya existe
  const existingTag = await payload.find({
    collection: 'tags',
    where: {
      name: {
        equals: genreName.toLowerCase(),
      },
    },
  })

  if (existingTag.docs.length > 0) {
    return existingTag.docs[0].id
  }

  // Si no existe, crear nuevo tag
  const newTag = await payload.create({
    collection: 'tags',
    data: {
      name: genreName.toLowerCase(),
      description: `Género musical: ${genreName}`,
    },
  })

  return newTag.id
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
    // Obtener token de Spotify
    const spotifyToken = await getSpotifyToken()

    // Obtener conciertos futuros
    const tomorrow = add(new Date(), { days: 1 })
    const concerts = await payload.find({
      collection: 'concerts',
      limit: 30,
      where: {
        and: [
          {
            startDate: {
              greater_than: tomorrow.toISOString(),
            },
          },
          {
            status: {
              equals: 'draft',
            },
          },
          {
            or: [
              {
                tags: {
                  exists: false,
                },
              },
              {
                tags: {
                  equals: [],
                },
              },
            ],
          },
        ],
      },
      depth: 2, // Para obtener la información completa de los artistas relacionados
    })

    const results = []

    // Procesar cada concierto
    for (const concert of concerts.docs) {
      try {
        // Limpiar tags existentes
        await payload.update({
          collection: 'concerts',
          id: concert.id,
          data: {
            tags: [],
          },
        })

        const tagIds = new Set<string>()
        const processedGenres = new Set<string>() // Para evitar duplicados

        // Procesar cada artista del concierto
        if (Array.isArray(concert.artists)) {
          for (const artist of concert.artists) {
            const genres = await searchArtistGenres(
              typeof artist === 'string' ? artist : artist.name,
              spotifyToken,
            )

            // Procesar cada género
            for (const genre of genres) {
              // Evitar procesar el mismo género más de una vez por concierto
              if (!processedGenres.has(genre)) {
                const tagId = await findOrCreateTag(genre)
                tagIds.add(tagId)
                processedGenres.add(genre)
              }
            }
          }
        }

        // Actualizar concierto con los nuevos tags
        await payload.update({
          collection: 'concerts',
          id: concert.id,
          data: {
            tags: Array.from(tagIds),
          },
        })

        results.push({
          concertId: concert.id,
          title: concert.title,
          status: 'success',
          tagsCount: tagIds.size,
          processedGenres: Array.from(processedGenres),
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
