import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, X, Disc } from 'lucide-react';
import { Artist } from '@/app/(frontend)/concerts/[slug]/types';

const SetlistView: React.FC<{
  artist: Artist;
  onClose: () => void;
}> = ({ artist, onClose }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("setlist");
  
  // Verificar si hay setlist disponible
  const hasSetlist = artist.setlist?.setlist && artist.setlist.setlist.length > 0;

  console.log('artist.setlist?', artist.setlist);
  // Información adicional ficticia (pueden añadirse estos campos al modelo Artist según necesidad)
  
  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Set tab inicial basado en disponibilidad
    if (!hasSetlist) {
      setActiveTab("info");
    }
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [hasSetlist]);

  return (
    <div className="col-span-3 transition-all animate-in slide-in-from-right duration-300">
      <Card className="mt-2 border-none border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 pb-3">
          <div>
            <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Disc className="w-5 h-5 text-primary" />
              Setlist de referencia
            </CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Cerrar setlist"
          >
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        
        <CardContent className="p-0">
        {hasSetlist ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Music className="w-4 h-4 text-primary" />
                      {artist.setlist?.setlistFmName}
                    </h3>
                  </div>
                  
                  <ScrollArea className="h-[300px] rounded-md p-4 bg-white">
                    <ol className="space-y-3">
                      {artist.setlist?.setlist.map((song, index) => (
                        <li key={index} className="flex items-start gap-3 group pb-2 border-b border-gray-100  last:border-0">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium group-hover:text-primary transition-colors">{song}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Music className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">
                    Setlist no disponible
                  </p>
                  <p className="text-xs text-muted-foreground/70 max-w-sm mt-2">
                    La lista de canciones aún no ha sido publicada o está sujeta a cambios.
                  </p>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetlistView;