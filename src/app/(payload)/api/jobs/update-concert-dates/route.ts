// src/app/(payload)/api/update-concert-dates/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })

export async function POST() {
  try {
    // Buscar conciertos que tengan startDate con hora 00:00:00
    const concerts = await payload.find({
      collection: 'concerts',
      limit: 1000,
      where: {
        and: [
          {
            startDate: {
              exists: true,
            },
          },
          {
            startDate: {
              like: '%T00:00:00%',
            },
          },
        ],
      },
    })

    const results = []

    // Procesar cada concierto
    for (const concert of concerts.docs) {
      try {
        const currentDate = new Date(concert.startDate)
        
        // Verificar si la hora es 00:00:00
        if (currentDate.getUTCHours() === 0) {
          // Crear nueva fecha con hora 12:00:00
          const newDate = new Date(currentDate)
          newDate.setUTCHours(12, 0, 0, 0)

          // Actualizar el concierto con la nueva fecha
          await payload.update({
            collection: 'concerts',
            id: concert.id,
            data: {
              startDate: newDate.toISOString(),
            },
          })

          results.push({
            concertId: concert.id,
            title: concert.title,
            oldDate: concert.startDate,
            newDate: newDate.toISOString(),
            status: 'success',
          })
        }
      } catch (error) {
        results.push({
          concertId: concert.id,
          title: concert.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: concerts.docs.length,
      updated: results.filter(r => r.status === 'success').length,
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