'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';
import FadeImage from '@/app/components/ui/fade-image';
import { ConcertViewProps } from './types';
import { Artist, Media, Venue } from '@/payload-types';

import DynamicArtistGrid from '@/app/components/artists/dynamic-artist-grid';
import VenueInfoTabs from '@/app/components/concerts/concert-venue-tabs';

const ConcertView: React.FC<ConcertViewProps> = ({ concert, formattedDate }) => {


    const populatedArtists = concert?.artists?.filter((artist): artist is Artist => 
        typeof artist !== 'string'
      ) || [];
    
  // Helper functions
  const getPosterUrl = (poster: string | Media): string => {
    if (typeof poster === 'string') return poster;
    return poster?.url || '';
  };

  const getVenueName = (venue: string | Venue): string => {
    if (typeof venue === 'string') return venue;
    return venue.name;
  };
  
  const venueInfo = {
    schedule: concert.schedule || null,
    venueMaps: concert.venueMaps || null,
    additionalInfo: concert.additionalInfo || null,
  };


  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav 
        className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" 
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <Link href="/" className="hover:text-foreground transition-colors">
          Conciertos
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="text-foreground" aria-current="page">
          {concert.title}
        </span>
      </nav>

      {/* Concert Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{concert.title}</h1>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
            <time dateTime={concert.startDate}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <address className="not-italic">{getVenueName(concert.venue)}</address>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster and Venue Info */}
        <div className="space-y-8">
          {concert.poster && (
            <Card>
              <CardContent className="p-0">
                <FadeImage
                  src={getPosterUrl(concert.poster)}
                  alt={`Poster for ${concert.title}`}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Artists Grid with Dynamic Setlist */}
         <DynamicArtistGrid artists={populatedArtists} />

         {/* Venue Info Tabs */}
        <div className="">
            <VenueInfoTabs info={venueInfo} />
        </div>
      </div>
    </main>
  );
};

export default ConcertView;