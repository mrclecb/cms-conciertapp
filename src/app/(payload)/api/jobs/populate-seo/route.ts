// src/app/(payload)/api/create-spotify-playlist/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'
import { generateSEO } from '@/app/utils/ai'

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
            and: [
              {
                'seo.metaTitle': {
                  in: [null, '']
                }
              }
            ]
          },
          {
            and: [
              {
                'seo.metaDescription': {
                  in: [null, '']
                }
              }
            ]
          },
          {
            and: [
              {
                'seo.keywords': {
                  in: [null, []]
                }
              }
            ]
          }
        ]
      }
    } )

    console.log(concerts, 'concerts')

    const results = []

    // Process each artist
    for (const concert of concerts.docs) {
      const info = await generateSEO(concert);
      try {

        await payload.update({
          collection: 'concerts',
          id: concert.id,
          data: {
            seo: {
              metaTitle: info.metatitle,
              metaDescription: info.metadescription,
              keywords: info.keywords,
              ogImage: concert.poster
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
          info,
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