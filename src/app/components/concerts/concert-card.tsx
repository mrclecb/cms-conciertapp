import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';


type ArtistType = {
  name: string;
  profileImage?: {
    url: string;
  };
  externalProfileURL?: string;
};

type ConcertCardProps = {
  id: string;
  title: string;
  date: string;
  venue: string;
  slug: string;
  artists: ArtistType[];
  poster?: {
    url: string;
  };
};

// Card con imagen de fondo y overlay
export function OverlayCard({ title, date, venue, artists, slug, poster }: ConcertCardProps) {
  return (
    <Link href={`/concerts/${slug}`}>
      <div className="relative h-64 overflow-hidden rounded-lg group">
        {/* Imagen de fondo con overlay gradiente */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url(${poster?.url})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
        
        {/* Contenido */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-300">{date}</p>
            <p className="font-medium text-gray-200">{venue}</p>
            <span className="text-sm">{artists.map(a => a.name).slice(0,9).join(', ')} {artists.length > 10 ? 'y mas' : ''} </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Card con imagen del artista
export function ArtistImageCard({ title, date, venue, artists, slug }: ConcertCardProps) {
  // Usar la primera imagen de artista disponible
  const artistImage = artists.find(a => a.profileImage)?.profileImage?.url || 
                     artists.find(a => a.externalProfileURL)?.externalProfileURL;

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        {/* Imagen lateral */}
        <div className="w-full md:w-2/5 h-48 md:h-auto relative">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url(${artistImage})`
            }}
          />
        </div>
        
        {/* Contenido */}
        <div className="w-full md:w-3/5 p-6">
          <Link href={`/concerts/${slug}`}>
            <h3 className="text-xl font-bold mb-4 hover:text-primary-500 transition-colors">
              {title}
            </h3>
          </Link>
          <div className="space-y-3">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-medium">{venue}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{artists.map(a => a.name).slice(0,9).join(', ')} {artists.length > 10 ? 'y mas' : ''} </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Card minimalista
export function MinimalCard({ title, date, venue, artists, slug }: ConcertCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
      <CardContent className="pt-6">
        <Link href={`/concerts/${slug}`}>
          <h3 className="text-lg font-bold mb-3 hover:text-primary-500 transition-colors">
            {title}
          </h3>
        </Link>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{date}</p>
          <p className="font-medium text-foreground">{venue}</p>
          <p>{artists.map(a => a.name).slice(0,9).join(', ')} {artists.length > 10 ? 'y mas' : ''}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Función principal que determina qué variante mostrar
export function ConcertCard(props: ConcertCardProps) {
  // Determinar la variante basada en la disponibilidad de imágenes
  const hasPoster = Boolean(props.poster?.url);
  const hasArtistImage = props.artists.some(
    artist => artist.profileImage?.url || artist.externalProfileURL
  );

  // Si no hay imágenes, usar minimal
  if (!hasPoster && !hasArtistImage) {
    return <MinimalCard {...props} />;
  }

  // Si hay poster y/o imagen de artista, alternar aleatoriamente
  if (hasPoster && hasArtistImage) {
    // Alternar aleatoriamente entre OverlayCard y ArtistImageCard
    return Math.random() > 0.5 ? 
      <OverlayCard {...props} /> : 
      <ArtistImageCard {...props} />;
  }

  // Si solo hay poster, usar OverlayCard
  if (hasPoster) {
    return <OverlayCard {...props} />;
  }

  // Si solo hay imagen de artista, usar ArtistImageCard
  if (hasArtistImage) {
    return <ArtistImageCard {...props} />;
  }

  // Fallback a minimal (aunque no deberíamos llegar aquí)
  return <MinimalCard {...props} />;
}

export default ConcertCard;