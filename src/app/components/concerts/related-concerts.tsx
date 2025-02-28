import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import FadeImage from '@/app/components/ui/fade-image';
import { CalendarDays, MapPin } from 'lucide-react';
import { Concert, Media, Venue } from '@/payload-types';

interface RelatedConcertsProps {
  currentConcertId: string;
  currentConcertTags: string[];
  futureConcerts: Concert[];
}

const RelatedConcerts: React.FC<RelatedConcertsProps> = ({ 
  currentConcertId, 
  currentConcertTags, 
  futureConcerts 
}) => {
  // Filter out current concert and find related concerts by matching tags
  const relatedConcerts = futureConcerts
    .filter(concert => {
      // Exclude current concert
      if (concert.id === currentConcertId) return false;
      
      // Check if concert has a future date
      const concertDate = new Date(concert.startDate);
      const today = new Date();
      if (concertDate < today) return false;
      
      // Check if there's at least one matching tag
      const concertTags = concert.tags?.map(tag => 
        typeof tag === 'string' ? tag : tag.id
      ) || [];
      
      return concertTags.some(tag => currentConcertTags.includes(tag));
    })
    .slice(0, 3); // Limit to 3 related concerts

  if (relatedConcerts.length === 0) {
    return null; // Don't render the section if no related concerts
  }

  // Helper functions
  const getPosterUrl = (poster: string | Media): string => {
    if (typeof poster === 'string') return poster;
    return poster?.url || '';
  };

  const getVenueName = (venue: string | Venue): string => {
    if (typeof venue === 'string') return venue;
    return venue.name || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Seguir explorando</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedConcerts.map((concert) => (
          <Link 
            href={`/concerts/${concert.slug}`} 
            key={concert.id}
            className="transition-transform duration-300 hover:scale-105"
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <FadeImage
                    src={concert.poster ? getPosterUrl(concert.poster) : ''}
                    alt={concert.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  {concert.status === 'published' && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      Próximo
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-2">{concert.title}</h3>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(concert.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{getVenueName(concert.venue)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedConcerts;