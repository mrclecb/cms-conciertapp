import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, X } from 'lucide-react';
import { Artist } from '@/app/(frontend)/concerts/[slug]/types';

const SetlistView: React.FC<{
    artist: Artist;
    onClose: () => void;
  }> = ({ artist, onClose }) => {
    return (
      <div className="col-span-3 transition-all">
        <Card className="mt-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-normal">{artist.name} - Setlist</CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Cerrar setlist"
            >
              <X className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            {artist.setlist?.setlist ? (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <ol className="space-y-2">
                  {artist.setlist.setlist.map((song, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{song}</span>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Setlist no disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default SetlistView;