// sitemap-generator.js
import payload from 'payload';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

async function generateSitemap() {
  try {
    // Inicializar Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.DATABASE_URI,
      local: true
    });

    // Crear un stream de sitemap
    const stream = new SitemapStream({
      hostname: 'https://conciert.app'
    });

    // Array para almacenar todas las URLs
    const links = [];

    // Agregar la página principal
    links.push({
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    });

    // Obtener todas las colecciones de Payload
    const collections = payload.collections;

    // Iterar sobre cada colección
    for (const collection of Object.values(collections)) {
      try {
        const docs = await payload.find({
          collection: collection.slug,
          limit: 1000
        });

        // Agregar cada documento a los links
        docs.docs.forEach(doc => {
          links.push({
            url: `/${collection.slug}/${doc.slug || doc.id}`,
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: doc.updatedAt
          });
        });
      } catch (error) {
        console.error(`Error al procesar la colección ${collection.slug}:`, error);
      }
    }

    // Crear el sitemap
    const sitemap = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then(data => data.toString());

    // Guardar el sitemap
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generado exitosamente');

    // Cerrar la conexión de Payload
    await payload.disconnect();
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    process.exit(1);
  }
}

// Ejecutar el generador
generateSitemap();