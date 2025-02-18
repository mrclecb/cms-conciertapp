// src/app/(payload)/api/create-spotify-playlist/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'

const payload = await getPayload({ config: configPromise })

interface SpotifyPlaylistResponse {
  id: string
  external_urls: {
    spotify: string
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

async function createPlaylist(
  userId: string,
  playlistName: string,
  description: string,
  token: string
): Promise<SpotifyPlaylistResponse> {
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: playlistName,
      description,
      public: true,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Error creating playlist: ${response.statusText} - ${JSON.stringify(errorData)}`)
  }

  return await response.json()
}

async function findSpotifyTracks(
  songList: string[],
  artistName: string,
  token: string
): Promise<string[]> {
  const trackUris: string[] = []

  for (const songName of songList) {
    try {
      // Búsqueda específica con artista
      const searchQuery = encodeURIComponent(`track:"${songName}" artist:"${artistName}"`)
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Error searching tracks: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.tracks?.items.length > 0) {
        trackUris.push(data.tracks.items[0].uri)
      } else {
        // Búsqueda más flexible
        const flexibleQuery = encodeURIComponent(`${songName} ${artistName}`)
        const flexibleResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${flexibleQuery}&type=track&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!flexibleResponse.ok) {
          throw new Error(`Error in flexible search: ${flexibleResponse.statusText}`)
        }

        const flexibleData = await flexibleResponse.json()
        
        if (flexibleData.tracks?.items.length > 0) {
          trackUris.push(flexibleData.tracks.items[0].uri)
        } else {
          console.warn(`No se encontró track para: ${songName} de ${artistName}`)
        }
      }
    } catch (error) {
      console.error(`Error buscando track '${songName}':`, error)
    }
  }

  return trackUris
}

async function addTracksToPlaylist(
  playlistId: string,
  trackUris: string[],
  token: string
): Promise<void> {
  // Spotify only allows adding 100 tracks at a time
  for (let i = 0; i < trackUris.length; i += 100) {
    const chunk = trackUris.slice(i, i + 100)
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: chunk,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error adding tracks to playlist: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }
  }
}

export async function POST(request: Request) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access',
        },
        { status: 401 }
      )
    }

    // Obtener datos del body
    const body = await request.json()
    const { setlistId } = body

    if (!setlistId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Se requiere el ID del setlist',
        },
        { status: 400 }
      )
    }

    // Obtener el setlist
    const setlist = await payload.findByID({
      collection: 'setlists',
      id: setlistId,
    })

    if (!setlist) {
      return NextResponse.json(
        {
          success: false,
          error: 'Setlist no encontrado',
        },
        { status: 404 }
      )
    }

    // Obtener el artista - asegurarse de que estamos usando un string de ID
    let artistId = setlist.artist;
    
    // Si el artista es un objeto completo en lugar de un ID, extraer el ID
    if (typeof artistId === 'object' && artistId !== null && 'id' in artistId) {
      artistId = artistId.id;
    }
    
    const artist = await payload.findByID({
      collection: 'artists',
      id: artistId as string,
    })

    if (!artist) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artista no encontrado',
        },
        { status: 404 }
      )
    }

    // Obtener token de Spotify
    const spotifyToken = await getSpotifyToken()

    // ID del usuario (normalmente será un valor fijo para tu aplicación)
    const userId = process.env.SPOTIFY_USER_ID
    if (!userId) {
      throw new Error('SPOTIFY_USER_ID no está configurado')
    }

    // Preparar información de la playlist
    const playlistName = `Setlist: ${artist.name} - ${setlist.name}`
    let description = 'Playlist generada automáticamente desde un setlist'
    
    if (setlist.setlistFmName) {
      description += ` - Basado en: ${setlist.setlistFmName}`
    }

    // Crear la playlist
    const playlist = await createPlaylist(userId, playlistName, description, spotifyToken)

    // Buscar tracks y agregarlos a la playlist
    const songList = Array.isArray(setlist.setlist) ? setlist.setlist as string[] : []
    const trackUris = await findSpotifyTracks(songList, artist.name, spotifyToken)

    if (trackUris.length > 0) {
      await addTracksToPlaylist(playlist.id, trackUris, spotifyToken)
    }

    // Actualizar el setlist con la información de la playlist
    await payload.update({
      collection: 'setlists',
      id: setlistId,
      data: {
        playlistId: playlist.id,
        playlistLinkToShare: playlist.external_urls.spotify,
      },
    })

    return NextResponse.json({
      success: true,
      playlistId: playlist.id,
      playlistUrl: playlist.external_urls.spotify,
      trackCount: trackUris.length,
    })
  } catch (error) {
    console.error('Error creating Spotify playlist:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}