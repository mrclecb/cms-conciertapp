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
    
    const concerts = await payload.find({
      collection: 'concerts',
      limit: 50,
      depth: 2,
      where: {
        or: [
          {
            'additionalInfo.description': {
              in: [null, []]
            }
          },
          {
            additionalInfo: {
              in: [null, {}]
            }
          }
        ]
      }
    })
    console.log(concerts, 'concerts')

    const results = []

    // Process each artist
    for (const concert of concerts.docs) {
      try {
        
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

        results.push({
          concertId: concert.id,
          status: 'success',
        })
        
      } catch (error) {
        results.push({
          concertId: concert.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    } 

    return NextResponse.json({
      success: true,
      results
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