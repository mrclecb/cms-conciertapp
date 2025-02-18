// components/VenueInfoTabs.tsx
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageGallery, { ImageItem } from '../shared/image-gallery';
import { RichContentSection } from '../shared/rich-content';
import { Media } from '@/payload-types';
import { MapPin, Calendar, Map, Info } from 'lucide-react';
import Image from 'next/image';

interface PayloadImage {
  image?: string | Media | null;
  id?: string | null;
}

// Tipo para el RichText de Payload
interface RichTextNode {
  type: string;
  children: {
    type: string;
    version: number;
    [key: string]: unknown;
  }[];
  direction: "ltr" | "rtl" | null;
  format: "" | "center" | "end" | "left" | "start" | "right" | "justify";
  indent: number;
  version: number;
}

interface RichTextContent {
  root: RichTextNode;
  [key: string]: unknown;
}

export interface PayloadRichContentSection {
  description?: RichTextContent | null;
  images?: PayloadImage[] | null;
}

export interface PayloadVenueInfo {
  schedule?: PayloadRichContentSection | null;
  venueMaps?: PayloadImage[] | null;
  additionalInfo?: PayloadRichContentSection | null;
  venue?: VenueSection | null;
}

export interface VenueInfoTabsProps {
  info: PayloadVenueInfo;
}

export interface VenueSection {
  name: string,
  address?: string,
  imageUrl?: string
}

export interface VenueInfo {
  schedule?: RichContentSection | null;
  venueMaps?: ImageItem[] | null;
  additionalInfo?: RichContentSection | null;
  venue?: VenueSection | null;
}

export const transformVenueInfo = (payloadInfo: PayloadVenueInfo): VenueInfo => {
  const transformImages = (images?: PayloadImage[] | null): ImageItem[] | null => {
    if (!images) return null;
    return images
      .filter((item): item is Required<PayloadImage> => 
        item.image !== null && item.image !== undefined
      )
      .map(item => ({ image: item.image! }));
  };

  const transformRichContent = (
    content?: PayloadRichContentSection | null
  ): RichContentSection | null => {
    if (!content) return null;
    return {
      description: content.description,
      images: transformImages(content.images),
    };
  };

  return {
    schedule: transformRichContent(payloadInfo.schedule),
    venueMaps: transformImages(payloadInfo.venueMaps),
    additionalInfo: transformRichContent(payloadInfo.additionalInfo),
    venue: payloadInfo.venue,
  };
};

const VenueInfoTabs: React.FC<VenueInfoTabsProps> = ({ info }) => {
  const transformedInfo = transformVenueInfo(info);
  const { schedule, venueMaps, additionalInfo, venue } = transformedInfo;
  const hasSchedule = schedule?.description || (schedule?.images && schedule.images.length > 0);
  const hasVenueMaps = venueMaps && venueMaps.length > 0;
  const hasAdditionalInfo = additionalInfo?.description || (additionalInfo?.images && additionalInfo.images.length > 0);
  
  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Determinar el tab activo inicial basado en la disponibilidad
  useEffect(() => {
    if (hasAdditionalInfo) {
      setActiveTab("info");
    } else if (hasVenueMaps) {
      setActiveTab("maps");
    } else if (hasSchedule) {
      setActiveTab("schedule");
    }

    // Detectar si es dispositivo móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [hasSchedule, hasVenueMaps, hasAdditionalInfo]);

  if (!hasSchedule && !hasVenueMaps && !hasAdditionalInfo && !venue) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
     {venue && (
        <Card className="mb-4 overflow-hidden border border-gray-200 shadow-md transition-shadow hover:shadow-lg">
          {venue.imageUrl && venue.imageUrl.length > 0 && (
            <CardHeader className="p-0 relative h-56 sm:h-64 md:h-72">
              <Image
                src={venue.imageUrl}
                alt={venue.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                  {venue.name}
                </CardTitle>
                {venue.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm md:text-base text-gray-200">
                      {venue.address}
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
          )}
          {!venue.imageUrl && (
            <CardContent className="pt-6">
              <CardTitle className="text-2xl md:text-3xl mb-4">
                {venue.name}
              </CardTitle>
              {venue.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm md:text-base text-muted-foreground">
                    {venue.address}
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className={`w-full ${isMobile ? 'grid-cols-3' : ''} grid ${isMobile ? 'gap-1' : 'gap-2'} rounded-xl bg-muted p-1 md:w-auto md:flex md:justify-start`}>
        {hasAdditionalInfo && (
            <TabsTrigger 
              value="info" 
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all
                ${activeTab === 'info' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:bg-gray-100 hover:text-primary'}`}
              onClick={() => setActiveTab("info")}
            >
              <Info className={`h-4 w-4 ${isMobile ? 'mx-auto' : ''}`} />
              {!isMobile && "Info del evento"}
            </TabsTrigger>
          )}

          {hasSchedule && (
            <TabsTrigger 
              value="schedule" 
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all
                ${activeTab === 'schedule' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:bg-gray-100 hover:text-primary'}`}
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar className={`h-4 w-4 ${isMobile ? 'mx-auto' : ''}`} />
              {!isMobile && "Horarios"}
            </TabsTrigger>
          )}
          
          {hasVenueMaps && (
            <TabsTrigger 
              value="maps" 
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all
                ${activeTab === 'maps' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:bg-gray-100 hover:text-primary'}`}
              onClick={() => setActiveTab("maps")}
            >
              <Map className={`h-4 w-4 ${isMobile ? 'mx-auto' : ''}`} />
              {!isMobile && "Mapa"}
            </TabsTrigger>
          )}
        </TabsList>

        <div className="mt-6">
          {hasSchedule && (
            <TabsContent value="schedule" className="animate-in fade-in-50 duration-300">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Horarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichContentSection 
                    content={schedule} 
                    title='Horarios'
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasVenueMaps && (
            <TabsContent value="maps" className="animate-in fade-in-50 duration-300">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Mapa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageGallery 
                    images={venueMaps.filter((item): item is Required<ImageItem> => 
                      item.image !== null
                    )} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasAdditionalInfo && (
            <TabsContent value="info" className="animate-in fade-in-50 duration-300">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Información del evento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichContentSection 
                    content={additionalInfo} 
                    title=''
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>

 
    </div>
  );
};

export default VenueInfoTabs;