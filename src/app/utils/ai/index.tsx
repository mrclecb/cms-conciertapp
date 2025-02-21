import {generateObject, generateText} from 'ai';
import {z} from 'zod';
import {openai} from '@ai-sdk/openai';
import { Concert } from '@/payload-types';

const model = openai('gpt-4o-mini');


export async function generateInfo(name: string, date: string, venue: string, artists: string): Promise<string> {
    const prompt =
    ` vas a investigar acerca del evento ${name} de esta fecha ${date} en ${venue} en Chile` +
    ` y vas a escribir una reseña con datos del evento y con información valiosa de los performers del evento: ${artists}` +
    ` si el evento se acerca es en las proximas semanas sea mas extendido unos 6 parrafos, si el evento es en los proximos dias que sea mas corto entre 2 a 4 parrafos` + 
    ` no es necesario agregar titulo, solo comenzar con el texto`;

    const system = 'Eres un experto en SEO y en Copywriting, tienes experiencia en llegar en el uso de keywords a la hora de escribir blogs de música.';

    const {text} = await generateText({
        model,
        prompt,
        system,
    })

    return text;
}

type ConcertSEO = {
    metatitle: string,
    metadescription: string
    keywords: {
        id: string | null | undefined,
        keyword: string | null | undefined,
    }[] | undefined
}

const schema = z.object({
    metatitle: z.string().describe('Título optimizado para SEO (55-60 caracteres) - Considera el nombre de la app: Conciertapp o Conciert.app'),
    metadescription: z.string().describe("Descripción optimizada para SEO (150-160 caracteres)"),
    keywords: z.array(
        z.object({
            id: z.string().describe('Identificador único de la keyword'),
            keyword: z.string().describe('la keyword en si')
        })
    ).describe('Las keywords del concierto, de los artistas y del uso y posicionamiento de la webapp')
});

export async function generateSEO(concert: Concert): Promise<ConcertSEO> {
    const artists = concert.artists?.map((artist: any) => artist.name).join(', ') || ''; 
    const prompt =
    `Tienes que esctibir las metaetiquetas para el landing page o la vista única de una entidad tipo concierto o evento musical` + 
    `Los datos del concierto son: Performers: ${artists} la fecha de ${concert.startDate} en ${concert.venue}` + 
    `Genera keywords en base acentuando el nombre del evento: ${concert.title} en el lugar: ${concert.venue} y ${concert.title} ${concert.startDate}, tambien genera keywords para hacer crecer la webapp considerando el valor que agrega de tener toda la info de eventos a la mano incluido el probable setlist de cada artista`

    const system = 'Eres un experto en SEO y en Copywriting, tienes experiencia en llegar en el uso de keywords al momento de definir meta-tags eficaces a la hora de posicionarse en buscadores.' +
    'Necesitas posicionar tu naciente web app, su nombre es conciert.app o conciertapp y tienes que incentivar el uso de sus features como el acceso rápido a su información y a sus setlist';

    const {object} = await generateObject({
        schema,
        model,
        prompt,
        system,
    })

    return {
        metatitle: object.metatitle,
        metadescription: object.metadescription,
        keywords: object.keywords.map(keyword => ({
            id: keyword.id,
            keyword: keyword.keyword
        }))
    } as unknown as ConcertSEO;
}
