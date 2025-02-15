// src/app/(payload)/api/update-artist-images/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })

interface SpotifySearchResult {
  artists: {
    items: Array<{
      id: string
      name: string
      images: Array<{
        url: string
        height: number
        width: number
      }>
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

async function searchArtistImage(artistName: string, token: string): Promise<string | null> {
  try {
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

    // Get the most popular artist match
    if (data.artists.items.length > 0) {
      const sortedArtists = data.artists.items.sort((a, b) => b.popularity - a.popularity)
      const artist = sortedArtists[0]

      // Get the largest image available
      if (artist.images && artist.images.length > 0) {
        const sortedImages = artist.images.sort((a, b) => (b.width || 0) - (a.width || 0))
        return sortedImages[0].url
      }
    }

    return null
  } catch (error) {
    console.error(`Error getting image for artist ${artistName}:`, error)
    return null
  }
}

export async function POST() {
  try {
    // Get Spotify token
    const spotifyToken = await getSpotifyToken()

    // Get artists without profile images
    const artists = await payload.find({
      collection: 'artists',
      where: {
        or: [
          {
            externalProfileURL: {
              exists: false,
            },
          },
          {
            externalProfileURL: {
              equals: '',
            },
          },
        ],
      },
      limit: 50, // Process 50 artists at a time
    })

    const results = []

    // Process each artist
    for (const artist of artists.docs) {
      try {
        const imageUrl = await searchArtistImage(artist.name, spotifyToken)

        if (imageUrl) {
          // Update artist with the new image URL
          await payload.update({
            collection: 'artists',
            id: artist.id,
            data: {
              externalProfileURL: imageUrl,
            },
          })

          results.push({
            artistId: artist.id,
            name: artist.name,
            status: 'success',
            imageUrl,
          })
        } else {
          results.push({
            artistId: artist.id,
            name: artist.name,
            status: 'not_found',
            message: 'No Spotify image found',
          })
        }
      } catch (error) {
        results.push({
          artistId: artist.id,
          name: artist.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: artists.docs.length,
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
