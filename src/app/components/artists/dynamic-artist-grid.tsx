import React, { useState } from 'react';
import ArtistCard from './artist-card';
import SetlistView from '../setlist/setlist-view';
import { Artist } from '@/app/(frontend)/concerts/[slug]/types';

interface ArtistGridProps {
    artists: Artist[];
  }
  
const DynamicArtistGrid: React.FC<ArtistGridProps> = ({ artists }) => {
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  
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
      <div 
        className="grid grid-cols-3 gap-2 w-full h-fit"
        role="grid"
      >
        {gridItems}
      </div>
    );
  };
  
  export default DynamicArtistGrid;