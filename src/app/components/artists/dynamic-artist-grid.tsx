'use client';
import React, { useState } from 'react';
import ArtistCard from './artist-card';
import SetlistView from '../setlist/setlist-view';
import { Artist } from '@/app/(frontend)/concerts/[slug]/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, X } from 'lucide-react';

interface ArtistGridProps {
    artists: Artist[];
  }
  
const DynamicArtistGrid: React.FC<ArtistGridProps> = ({ artists }) => {
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [isVisible, setIsVisible] = useState(true);
  
    // Calculate the grid items with setlist insertion
    const gridItems = React.useMemo(() => {
      const items: React.ReactNode[] = [];
      const itemsPerRow = 3;
  
      artists.forEach((artist, index) => {
        // Add artist card
        items.push(
          <ArtistCard
            key={artist.id}
            artist={artist}
            isSelected={selectedArtist?.id === artist.id}
            onClick={() => setSelectedArtist(selectedArtist?.id === artist.id ? null : artist)}
          />
        );
  
        // If this is the selected artist and it's the last in its row
        // or if the selected artist is in this row but not the last
        if (selectedArtist && Math.floor(index / itemsPerRow) === Math.floor(artists.indexOf(selectedArtist) / itemsPerRow)) {
          if ((index + 1) % itemsPerRow === 0 || index === artists.length - 1) {
            items.push(
              <SetlistView
                key={`setlist-${selectedArtist.id}`}
                artist={selectedArtist}
                onClose={() => setSelectedArtist(null)}
              />
            );
          }
        }
      });
  
      return items;
    }, [artists, selectedArtist]);
  
    return (
      <div>
        
        
      { isVisible && <Alert className="bg-blue-50 border-blue-100 flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
          <AlertDescription className="text-blue-500 m-0">
            Toca en tu artista favorito para ver su setlist
          </AlertDescription>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-blue-400 hover:text-blue-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>}

      <div 
        className="grid grid-cols-3 gap-2 w-full h-fit"
        role="grid"
      >
        {gridItems}
      </div>

      </div>
      
    );
  };
  
  export default DynamicArtistGrid;