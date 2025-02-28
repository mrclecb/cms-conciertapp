// src/app/(payload)/api/save-setlist/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'

const payload = await getPayload({ config: configPromise })

interface LastFmSetlist {
  id: string,
  artist: {
    name: string,
    mbid: string
  },
  eventDate: string,
  venue: {
    name: string
    id: string
  }
  tour?: {
    name: string
  }
  sets: {
    set: Array<{
      song: Array<{
        name: string
      }>
    }>
  }
}

async function getSetlistById(setlistId: string): Promise<LastFmSetlist | null> {
  try {
    const apiKey = process.env.SETLIST_FM_API_KEY
    
    const response = await fetch(
      `https://api.setlist.fm/rest/1.0/setlist/${setlistId}`,
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

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error getting setlist with ID ${setlistId}:`, error)
    return null
  }
}

async function findArtistByName(artistName: string) {
  const artists = await payload.find({
    collection: 'artists',
    where: {
      name: {
        equals: artistName,
      },
    },
  })

  if (artists.docs.length > 0) {
    return artists.docs[0]
  }

  return null
}

async function createSetlist(artistId: string, artistName: string, songs: string[], setlistFmId: string, setlistFmName: string) {
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
      setlistFmId,
      setlistFmName
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

    // Extraer el setlist ID del cuerpo de la solicitud
    const body = await request.json()
    const { setlistId } = body

    if (!setlistId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing setlistId in request body',
        },
        { status: 400 },
      )
    }

    // Obtener el setlist de la API de Setlist.fm
    const setlistData = await getSetlistById(setlistId)

    if (!setlistData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Setlist not found',
        },
        { status: 404 },
      )
    }

    // Extraer información del setlist
    const artistName = setlistData.artist.name
    const songs: string[] = []

    // Extraer canciones de todos los sets
    if (setlistData.sets && setlistData.sets.set) {
      setlistData.sets.set.forEach((set) => {
        if (set.song && Array.isArray(set.song)) {
          set.song.forEach((song) => {
            if (song.name && song.name.trim()) {
              songs.push(song.name.trim())
            }
          })
        }
      })
    }

    // Crear un nombre representativo para el setlist
    const venue = setlistData.venue?.name || 'Desconocido'
    const eventDate = setlistData.eventDate || 'Fecha desconocida'
    const tour = setlistData.tour?.name ? ` (${setlistData.tour.name})` : ''
    const setlistFmName = `${venue}, ${eventDate}${tour}`

    // Buscar el artista en nuestra base de datos
    const artist = await findArtistByName(artistName)

    if (!artist) {
      return NextResponse.json(
        {
          success: false,
          error: `Artist "${artistName}" not found in database`,
        },
        { status: 404 },
      )
    }

    // Crear el setlist
    const createdSetlist = await createSetlist(
      artist.id,
      artistName,
      songs,
      setlistData.id,
      setlistFmName
    )

    return NextResponse.json({
      success: true,
      setlist: {
        id: createdSetlist.id,
        name: createdSetlist.name,
        artistId: artist.id,
        artistName: artist.name,
        songsCount: songs.length,
        setlistFmId: setlistData.id,
        setlistFmName
      },
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