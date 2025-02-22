// src/app/(payload)/api/create-spotify-playlist/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateApiKey } from '@/app/utils'
import { generateInfo, generateSEO } from '@/app/utils/ai'
import { Artist } from '@/payload-types'

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
    
    const info = await generateSEO(concert);
    

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
function textToPayloadRichText(text: string, direction: Direction = "ltr"): PayloadRichText {
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