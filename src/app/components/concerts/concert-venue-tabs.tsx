// components/VenueInfoTabs.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ImageGallery, { ImageItem } from '../shared/image-gallery';
import { RichContentSection } from '../shared/rich-content';
import { Media } from '@/payload-types';

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
  }

export interface VenueInfoTabsProps {
    info: PayloadVenueInfo;
  }

  export interface VenueInfo {
    schedule?: RichContentSection | null;
    venueMaps?: ImageItem[] | null;
    additionalInfo?: RichContentSection | null;
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
    };
  };

const VenueInfoTabs: React.FC<VenueInfoTabsProps> = ({ info }) => {
    const transformedInfo = transformVenueInfo(info);
    const { schedule, venueMaps, additionalInfo } = transformedInfo;
    const hasSchedule = schedule?.description || (schedule?.images && schedule.images.length > 0);
    const hasVenueMaps = venueMaps && venueMaps.length > 0;
    const hasAdditionalInfo = additionalInfo?.description || (additionalInfo?.images && additionalInfo.images.length > 0);
    
  
    if (!hasSchedule && !hasVenueMaps && !hasAdditionalInfo) return null;
  
    return (
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          {hasSchedule && <TabsTrigger value="schedule">Horarios</TabsTrigger>}
          {hasVenueMaps && <TabsTrigger value="maps">Mapa</TabsTrigger>}
          {hasAdditionalInfo && <TabsTrigger value="info">Información relevante</TabsTrigger>}
        </TabsList>
  
        {hasSchedule && (
          <TabsContent value="schedule">
            <RichContentSection 
              content={schedule} 
              title="Horarios" 
            />
          </TabsContent>
        )}
  
        {hasVenueMaps && (
          <TabsContent value="maps">
            <Card>
              <CardContent className="pt-6">
                <ImageGallery 
                  images={venueMaps.filter((item): item is Required<ImageItem> => 
                    item.image !== null
                  )} 
                  title="Mapa" 
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
  
        {hasAdditionalInfo && (
          <TabsContent value="info">
            <RichContentSection 
              content={additionalInfo} 
              title="Información relevante" 
            />
          </TabsContent>
        )}
      </Tabs>
    );
  };

export default VenueInfoTabs;