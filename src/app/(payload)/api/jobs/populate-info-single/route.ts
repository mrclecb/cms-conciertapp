// src/app/(payload)/api/create-spotify-playlist/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'
import { generateInfo } from '@/app/utils/ai'
import { textToPayloadRichText } from '../../../../lib/utils'

const payload = await getPayload({ config: configPromise })

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
    const { concertId } = body

    if (!concertId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Se requiere el ID del concert',
        },
        { status: 400 }
      )
    }

    const concert = await payload.findByID({
      collection: 'concerts',
      id: concertId,
      depth: 2,
    })
    const venueName = typeof concert.venue === 'string' ? '' : concert.venue?.name || '';
    const artists = concert.artists?.map((artist: any) => artist.name).join(', ') || ''; 
    const info = await generateInfo(concert.title, concert.startDate, venueName, artists);
    

    await payload.update({
      collection: 'concerts',
      id: concert.id,
      data: {
        additionalInfo: {
          description: textToPayloadRichText(info),
        }
      },
    })

    return NextResponse.json({
      success: true,
    });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}