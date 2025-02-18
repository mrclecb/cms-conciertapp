// app/robots.txt/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Disallow: /admin/
Allow: /

Sitemap: http://conciert.app/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}