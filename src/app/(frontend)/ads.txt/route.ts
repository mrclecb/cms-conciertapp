// app/robots.txt/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const ads = `google.com, pub-7692922132309887, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(ads, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}