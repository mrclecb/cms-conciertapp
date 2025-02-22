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


// Define los tipos para la estructura de RichText de Payload
type Direction = "ltr" | "rtl" | null | undefined;

type Format = "" | "left" | "start" | "center" | "right" | "end" | "justify" | undefined

interface TextNode {
  detail: number;
  format: number;
  mode: "normal";
  style: string;
  text: string;
  type: "text";
  version: number;
  [key: string]: any; // Permite propiedades adicionales con índice de tipo string
}

interface ParagraphNode {
  children: TextNode[];
  direction: Direction;
  format: Format;
  indent: number;
  type: "paragraph";
  version: number;
  textFormat: number;
  textStyle: string;
  [key: string]: any; // Permite propiedades adicionales con índice de tipo string
}

interface RootNode {
  children: ParagraphNode[];
  direction: Direction;
  format: Format;
  indent: number;
  type: "root";
  version: number;
  [key: string]: any; // Permite propiedades adicionales con índice de tipo string
}

interface PayloadRichText {
  root: RootNode;
  [key: string]: any;
}

/**
 * Convierte texto plano a la estructura de RichText de Payload CMS
 * @param text - El texto plano a convertir
 * @param direction - La dirección del texto ("ltr" o "rtl")
 * @returns La estructura de RichText compatible con Payload CMS
 */
export function textToPayloadRichText(text: string, direction: Direction = "ltr"): PayloadRichText {
  // Dividir el texto en párrafos
  const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
  
  // Si no hay texto, crear al menos un párrafo vacío
  if (paragraphs.length === 0) {
    paragraphs.push('');
  }
  
  // Crear los nodos de párrafo
  const children: ParagraphNode[] = paragraphs.map(paragraph => {
    const textNode: TextNode = {
      detail: 0,
      format: 0,
      mode: "normal",
      style: "",
      text: paragraph.trim(),
      type: "text",
      version: 1
    };
    
    const paragraphNode: ParagraphNode = {
      children: [textNode],
      direction: direction,
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
      textFormat: 0,
      textStyle: ""
    };
    
    return paragraphNode;
  });
  
  // Construir la estructura completa
  const rootNode: RootNode = {
    children: children,
    direction: direction,
    format: "",
    indent: 0,
    type: "root",
    version: 1
  };
  
  return {
    root: rootNode
  };
}