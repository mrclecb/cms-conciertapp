// src/app/(payload)/api/update-artist-setlists/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'

const payload = await getPayload({ config: configPromise })

interface LastFmSetlist {
  id: string,
  artist: string
  eventDate:string,
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

interface LastFmResponse {
  setlist: LastFmSetlist[]
}

async function getLastFmSetlist(
  artistName: string
): Promise<{ songs: string[]; setlistFmId: string; setlistFmName: string } | null> {
  try {
    const apiKey = process.env.SETLIST_FM_API_KEY
    const encodedName = encodeURIComponent(artistName.trim())
    
    // Modificación: Vamos a intentar con hasta 5 páginas para encontrar un setlist adecuado
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodedName}&p=${page}`,
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

      // Si no hay setlists en esta página, terminamos la búsqueda
      if (!data.setlist || data.setlist.length === 0) {
        break
      }

      // Procesar setlists en orden cronológico (más recientes primero, ya que así vienen por defecto)
      for (const setlist of data.setlist) {
        const songs: string[] = []

        // Extraer canciones de todos los sets
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

        // Si encontramos un setlist con al menos 4 canciones, lo usamos
        if (songs.length >= 4) {
          // Crear un nombre representativo para el setlist
          const venue = setlist.venue?.name || 'Desconocido'
          const eventDate = setlist.eventDate || 'Fecha desconocida'
          const tour = setlist.tour?.name ? ` (${setlist.tour.name})` : ''
          const setlistFmName = `${venue}, ${eventDate}${tour}`
          
          return {
            songs,
            setlistFmId: setlist.id || '',
            setlistFmName
          }
        }
      }
      
      // Si hemos llegado aquí, ningún setlist en esta página tenía 4+ canciones
      // Continuamos con la siguiente página para buscar setlists más antiguos
    }

    // Si hemos explorado todas las páginas y no encontramos ningún setlist adecuado,
    // hacemos una última pasada para encontrar el mejor setlist disponible
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
    
    // Buscar el setlist con más canciones, incluso si tiene menos de 4
    let bestSetlist: {
      songs: string[];
      setlistFmId: string;
      setlistFmName: string;
    } | null = null;

    for (const setlist of data.setlist) {
      const songs: string[] = []

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

      if (!bestSetlist || songs.length > bestSetlist.songs.length) {
        // Crear un nombre representativo para el setlist
        const venue = setlist.venue?.name || 'Desconocido'
        const eventDate = setlist.eventDate || 'Fecha desconocida'
        const tour = setlist.tour?.name ? ` (${setlist.tour.name})` : ''
        const setlistFmName = `${venue}, ${eventDate}${tour}`
        
        bestSetlist = {
          songs,
          setlistFmId: setlist.id || '',
          setlistFmName
        }
      }
    }

    if (bestSetlist && bestSetlist.songs.length > 0) {
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

async function createSetlist(artistId: string, artistName: string, songs: string[], setlistFmId?: string, setlistFmName?: string) {
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
    // Get artists without setlists
    const artists = await payload.find({
      collection: 'artists',
      limit: 320,
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
            const setlist = await createSetlist(artist.id, artist.name, songs.songs, songs.setlistFmId, songs.setlistFmName)

            results.push({
              artistId: artist.id,
              name: artist.name,
              status: 'success',
              setlistId: setlist.id,
              songsCount: songs.songs.length,
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
