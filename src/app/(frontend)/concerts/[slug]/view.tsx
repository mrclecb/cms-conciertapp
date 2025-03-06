'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ChevronRight, CalendarDays, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import FadeImage from '@/app/components/ui/fade-image';
import { ConcertViewProps } from './types';
import { Artist, Media, Venue, Concert } from '@/payload-types';

import DynamicArtistGrid from '@/app/components/artists/dynamic-artist-grid';
import VenueInfoTabs from '@/app/components/concerts/concert-venue-tabs';
import RelatedConcerts from '@/app/components/concerts/related-concerts';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { useTheme } from '@/app/components/shared/theme-provider';
const GradientText: React.FC<{ text: React.ReactElement, maxHeight?: number }> = ({ text, maxHeight = 200 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  
  const beforeGradient = isDark ? 'before:from-[#121212] before:to-transparent' : 'before:from-white before:to-transparent';
  
  return (
    <div className="relative">
      <div
        className={`relative ${
          !isExpanded
            ? "max-h-52 overflow-hidden before:absolute before:bottom-0 before:left-0 before:h-24 before:w-full before:bg-gradient-to-t " + beforeGradient
            : ""
        }`}
      >
        <div className="prose max-w-none">
          {text}
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </Button>
      </div>
    </div>
  );
};

// Extendiendo ConcertViewProps para incluir los conciertos futuros
interface ExtendedConcertViewProps extends ConcertViewProps {
  futureConcerts?: Concert[];
}

const ConcertView: React.FC<ExtendedConcertViewProps> = ({ concert, formattedDate, futureConcerts = [] }) => {
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
    return venue.name || '';
  };

  const getVenueAddress = (venue: string | Venue): string => {
    if (typeof venue === 'string') return venue;
    return venue.address || ''; 
  };

  const getVenueImageUrl = (venue: string | Venue): string => {
    if (typeof venue === 'string') {
      return '';
    }
    if (typeof venue.images?.[0]?.image === 'string') {
      return '';
    }
    return venue.images?.[0]?.image?.url || '';
  }

  const venueSection = {
    name: getVenueName(concert.venue),
    address: getVenueAddress(concert.venue),
    imageUrl: getVenueImageUrl(concert.venue)
  }
  const info = {
    schedule: concert.schedule || null,
    venueMaps: concert.venueMaps || null,
    additionalInfo: concert.additionalInfo || null,
    venue: venueSection,
  };

  // Extract concert tags for related concerts
  const concertTags = concert.tags?.map(tag => 
    typeof tag === 'string' ? tag : tag.id
  ) || [];

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{concert.title}</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {concert?.ticketsLink && (
            <a
              href={concert?.ticketsLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gray-700 hover:border-white w-full sm:w-auto text-sm sm:text-base"
            >
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Comprar tickets</span>
            </a>
          )}
        </div>
      </div>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{getVenueName(concert.venue)}</span>
          </div>
        </div>
      </div>

      { concert?.artists && concert.artists.length < 6 ?
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-0 lg:gap-8">
        <div className='grid col-span-2 gap-8 content-start'>
        <div>
          {concert?.additionalInfo?.description && <GradientText maxHeight={400} text={<RichText data={concert.additionalInfo.description} />} />}
        </div>
        
        {/* Sección de Seguir Explorando - Solo visible en desktop */}
        <div className="hidden lg:block">
          {futureConcerts.length > 0 && (
            <RelatedConcerts 
              currentConcertId={concert.id}
              currentConcertTags={concertTags}
              futureConcerts={futureConcerts}
            />
          )}
        </div>
        
        {/* Poster and Venue Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        </div>
        </div>
        <div className='grid col-span-1 gap-8 content-start'>
          
          {/* Artists Grid with Dynamic Setlist */}
         <DynamicArtistGrid artists={populatedArtists} />

         {concert.poster && (
            <Card className='border-none shadow-none'>
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


          {/* Info Tabs */}
          <VenueInfoTabs info={info} />
        </div>
      </div>

      : <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
      <div className='grid col-span-2 gap-8 content-start'>
      <div>
        {concert?.additionalInfo?.description && <GradientText maxHeight={200} text={<RichText data={concert.additionalInfo.description} />} />}
      </div>
      
      {/* Sección de Seguir Explorando - Solo visible en desktop */}
      <div className="hidden lg:block">
        {futureConcerts.length > 0 && (
          <RelatedConcerts 
            currentConcertId={concert.id}
            currentConcertTags={concertTags}
            futureConcerts={futureConcerts}
          />
        )}
      </div>
      
      {/* Poster and Venue Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {concert.poster && (
          <Card className='border-none shadow-none'>
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

        {/* Info Tabs */}
        <VenueInfoTabs info={info} />
      </div>

      </div>

      {/* Artists Grid with Dynamic Setlist */}
       <DynamicArtistGrid artists={populatedArtists} />
    </div>}

    {/* Sección de Seguir Explorando - Visible solo en mobile al final de todo el contenido */}
    <div className="lg:hidden mt-8 mb-4">
      {futureConcerts.length > 0 && (
        <RelatedConcerts 
          currentConcertId={concert.id}
          currentConcertTags={concertTags}
          futureConcerts={futureConcerts}
        />
      )}
    </div>
  
    </main>
  );
};

export default ConcertView;