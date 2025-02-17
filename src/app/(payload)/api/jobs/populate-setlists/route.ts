// src/app/(payload)/api/update-artist-setlists/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'

const payload = await getPayload({ config: configPromise })

interface LastFmSetlist {
  artist: string
  venue: {
    name: string
    id: string
  }
  sets: {
    set: Array<{
      song: Array<{
        name: string
      }>
    }>
  }
}

interface LastFmResponse {
  setlist: LastFmSetlist[]
}

async function getLastFmSetlist(artistName: string): Promise<string[] | null> {
  try {
    const apiKey = process.env.SETLIST_FM_API_KEY
    const encodedName = encodeURIComponent(artistName.trim())

    const response = await fetch(
      `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodedName}&p=1`,
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': apiKey as string,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Error fetching setlist: ${response.statusText}`)
    }

    const data: LastFmResponse = await response.json()

    // Look through all setlists to find one with enough songs
    let bestSetlist: string[] = []

    for (const setlist of data.setlist) {
      const songs: string[] = []

      // Extract songs from all sets
      if (setlist.sets && setlist.sets.set) {
        setlist.sets.set.forEach((set) => {
          if (set.song && Array.isArray(set.song)) {
            set.song.forEach((song) => {
              if (song.name && song.name.trim()) {
                songs.push(song.name.trim())
              }
            })
          }
        })
      }

      // Keep track of the setlist with the most songs
      if (songs.length > bestSetlist.length) {
        bestSetlist = songs
      }

      // If we found a setlist with at least 2 songs, use it
      if (songs.length >= 2) {
        return songs
      }
    }

    // If we didn't find any setlist with 2+ songs but found some songs, return the best one
    if (bestSetlist.length > 0) {
      return bestSetlist
    }

    return null
  } catch (error) {
    console.error(`Error getting setlist for artist ${artistName}:`, error)
    return null
  }
}

async function findExistingSetlist(artistId: string): Promise<boolean> {
  const existingSetlist = await payload.find({
    collection: 'setlists',
    where: {
      artist: {
        equals: artistId,
      },
    },
  })

  return existingSetlist.docs.length > 0
}

async function createSetlist(artistId: string, artistName: string, songs: string[]) {
  // Validar que tengamos canciones y sean un array
  if (!Array.isArray(songs) || songs.length === 0) {
    throw new Error('Setlist must contain at least one song')
  }

  // Validar que todas las canciones sean strings válidos
  const validSongs = songs.filter((song) => typeof song === 'string' && song.trim().length > 0)

  if (validSongs.length === 0) {
    throw new Error('No valid songs found in setlist')
  }

  return await payload.create({
    collection: 'setlists',
    data: {
      name: `${artistName} Setlist`,
      artist: artistId,
      setlist: validSongs,
    },
  })
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
    // Get artists without setlists
    const artists = await payload.find({
      collection: 'artists',
      limit: 10000,
    })

    const results = []

    // Process each artist
    for (const artist of artists.docs) {
      try {
        // Check if artist already has a setlist
        const hasSetlist = await findExistingSetlist(artist.id)

        if (!hasSetlist) {
          const songs = await getLastFmSetlist(artist.name)

          if (songs) {
            // Create new setlist
            const setlist = await createSetlist(artist.id, artist.name, songs)

            results.push({
              artistId: artist.id,
              name: artist.name,
              status: 'success',
              setlistId: setlist.id,
              songsCount: songs.length,
            })
          } else {
            results.push({
              artistId: artist.id,
              name: artist.name,
              status: 'not_found',
              message: 'No setlist found on Last.fm',
            })
          }
        } else {
          results.push({
            artistId: artist.id,
            name: artist.name,
            status: 'skipped',
            message: 'Setlist already exists',
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
