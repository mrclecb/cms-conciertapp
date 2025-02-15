import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })

export async function GET(request: Request) {
  try {
    // Usando 'featured' en lugar de 'active'
    const tags = await payload.find({
      collection: 'tags',
      where: {
        featured: {
          equals: true
        }
      },
      sort: 'order',
    })

    return NextResponse.json({
      success: true,
      popularTags: tags.docs.map(tag => ({
        id: tag.id,
        name: tag.name,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    )
  }
}