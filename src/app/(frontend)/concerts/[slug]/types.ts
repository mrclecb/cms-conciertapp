// types.ts
import { Concert } from '@/payload-types';

export interface Tag {
  id: string;
  name: string;
}

export interface Artist {
  id: string;
  name: string;
  externalProfileURL?: string | null;
  description?: string;
  setlist?: {
    setlist: string[];
  };
}

export interface ConcertViewProps {
  concert: Concert;
  formattedDate: string;
}