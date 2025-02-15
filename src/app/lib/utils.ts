export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
    });
  }


export const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
      .trim();
  };
// Opción 1: Usando Last.fm API
export async function getArtistImageFromLastFm(artistName: string, apiKey: string) {
    try {
        const response = await fetch(
            `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Last.fm proporciona varias tamaños de imagen
        const images = data.artist?.image || [];
        // Obtener la imagen más grande (última en el array)
        const largeImage = images.find((img: any) => img.size === 'mega' || img.size === 'extralarge');
        
        return largeImage?.['#text'] || null;
    } catch (error) {
        console.error('Error getting Last.fm image:', error);
        return null;
    }
}

// Opción 2: Usando Spotify API
export async function getArtistImageFromSpotify(artistName: string, clientId: string, clientSecret: string) {
    try {
        // 1. Obtener token de acceso
        const authResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        // 2. Buscar artista
        const searchResponse = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const searchData = await searchResponse.json();
        
        if (searchData.artists?.items?.length > 0) {
            const artist = searchData.artists.items[0];
            // Spotify proporciona varias imágenes, tomamos la más grande
            return artist.images[0]?.url || null;
        }

        return null;
    } catch (error) {
        console.error('Error getting Spotify image:', error);
        return null;
    }
}

// Función que intenta obtener la imagen de múltiples fuentes
export async function getArtistImage(artistName: string, config: {
    lastFmApiKey?: string;
    spotifyClientId?: string;
    spotifyClientSecret?: string;
}) {
    // Intentar primero con Spotify si las credenciales están disponibles
    if (config.spotifyClientId && config.spotifyClientSecret) {
        const spotifyImage = await getArtistImageFromSpotify(
            artistName,
            config.spotifyClientId,
            config.spotifyClientSecret
        );
        if (spotifyImage) return spotifyImage;
    }

    // Si no hay imagen de Spotify, intentar con Last.fm
    if (config.lastFmApiKey) {
        const lastFmImage = await getArtistImageFromLastFm(artistName, config.lastFmApiKey);
        if (lastFmImage) return lastFmImage;
    }

    return null;
}