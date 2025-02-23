/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
    'third-party-access': ThirdPartyAccessAuthOperations;
  };
  collections: {
    users: User;
    media: Media;
    artists: Artist;
    tags: Tag;
    venues: Venue;
    concerts: Concert;
    setlists: Setlist;
    'third-party-access': ThirdPartyAccess;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    artists: ArtistsSelect<false> | ArtistsSelect<true>;
    tags: TagsSelect<false> | TagsSelect<true>;
    venues: VenuesSelect<false> | VenuesSelect<true>;
    concerts: ConcertsSelect<false> | ConcertsSelect<true>;
    setlists: SetlistsSelect<false> | SetlistsSelect<true>;
    'third-party-access': ThirdPartyAccessSelect<false> | ThirdPartyAccessSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user:
    | (User & {
        collection: 'users';
      })
    | (ThirdPartyAccess & {
        collection: 'third-party-access';
      });
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
export interface ThirdPartyAccessAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "artists".
 */
export interface Artist {
  id: string;
  name: string;
  bio?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  profileImage?: (string | null) | Media;
  images?:
    | {
        image?: (string | null) | Media;
        id?: string | null;
      }[]
    | null;
  externalProfileURL?: string | null;
  socialMedia?: {
    instagram?: string | null;
    twitter?: string | null;
    spotify?: string | null;
    website?: string | null;
  };
  status: 'draft' | 'published';
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags".
 */
export interface Tag {
  id: string;
  name: string;
  description?: string | null;
  /**
   * Mostrar este tag en los filtros de conciertos
   */
  featured?: boolean | null;
  /**
   * Orden de aparición (menor número = aparece primero)
   */
  order?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "venues".
 */
export interface Venue {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  capacity?: number | null;
  coordinates?: {
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  images?:
    | {
        image?: (string | null) | Media;
        id?: string | null;
      }[]
    | null;
  amenities?:
    | {
        name?: string | null;
        description?: string | null;
        id?: string | null;
      }[]
    | null;
  parkingInfo?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  status: 'draft' | 'published';
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "concerts".
 */
export interface Concert {
  id: string;
  title: string;
  slug: string;
  status?: ('draft' | 'published') | null;
  tags?: (string | Tag)[] | null;
  startDate: string;
  /**
   * Optional. Only if the event spans multiple days
   */
  endDate?: string | null;
  venue: string | Venue;
  artists?: (string | Artist)[] | null;
  poster?: (string | null) | Media;
  ticketsLink?: string | null;
  schedule?: {
    description?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    images?:
      | {
          image?: (string | null) | Media;
          id?: string | null;
        }[]
      | null;
  };
  venueMaps?:
    | {
        image?: (string | null) | Media;
        id?: string | null;
      }[]
    | null;
  additionalInfo?: {
    description?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    images?:
      | {
          image?: (string | null) | Media;
          id?: string | null;
        }[]
      | null;
  };
  /**
   * Configuración SEO para este concierto
   */
  seo?: {
    /**
     * Título optimizado para SEO (55-60 caracteres)
     */
    metaTitle?: string | null;
    /**
     * Descripción optimizada para SEO (150-160 caracteres)
     */
    metaDescription?: string | null;
    /**
     * Palabras clave relevantes para este concierto
     */
    keywords?:
      | {
          keyword?: string | null;
          id?: string | null;
        }[]
      | null;
    /**
     * Imagen para compartir en redes sociales (1200x630px recomendado)
     */
    ogImage?: (string | null) | Media;
    /**
     * Datos estructurados para eventos (Schema.org)
     */
    structuredData?: {
      performerType?: ('Person' | 'MusicGroup' | 'Organization') | null;
      eventStatus?: ('EventScheduled' | 'EventPostponed' | 'EventRescheduled' | 'EventCancelled') | null;
      /**
       * Ej: "$20 - $100"
       */
      priceRange?: string | null;
      availability?: ('InStock' | 'LimitedAvailability' | 'SoldOut' | 'PreSale') | null;
    };
    /**
     * URL canónica si es diferente a la URL por defecto
     */
    canonicalUrl?: string | null;
    /**
     * Marcar para evitar que este concierto sea indexado por buscadores
     */
    noIndex?: boolean | null;
  };
  /**
   * Información para tracking y analytics
   */
  trackingInfo?: {
    /**
     * Categoría para tracking de eventos
     */
    eventCategory?: ('concert' | 'festival' | 'acoustic' | 'release') | null;
    utmParameters?: {
      /**
       * UTM source por defecto para este evento
       */
      source?: string | null;
      /**
       * UTM medium por defecto para este evento
       */
      medium?: string | null;
      /**
       * UTM campaign por defecto para este evento
       */
      campaign?: string | null;
    };
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "setlists".
 */
export interface Setlist {
  id: string;
  name: string;
  artist: string | Artist;
  setlist:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  setlistFmId?: string | null;
  setlistFmName?: string | null;
  playlistId?: string | null;
  playlistLinkToShare?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "third-party-access".
 */
export interface ThirdPartyAccess {
  id: string;
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'artists';
        value: string | Artist;
      } | null)
    | ({
        relationTo: 'tags';
        value: string | Tag;
      } | null)
    | ({
        relationTo: 'venues';
        value: string | Venue;
      } | null)
    | ({
        relationTo: 'concerts';
        value: string | Concert;
      } | null)
    | ({
        relationTo: 'setlists';
        value: string | Setlist;
      } | null)
    | ({
        relationTo: 'third-party-access';
        value: string | ThirdPartyAccess;
      } | null);
  globalSlug?: string | null;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'third-party-access';
        value: string | ThirdPartyAccess;
      };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'third-party-access';
        value: string | ThirdPartyAccess;
      };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "artists_select".
 */
export interface ArtistsSelect<T extends boolean = true> {
  name?: T;
  bio?: T;
  profileImage?: T;
  images?:
    | T
    | {
        image?: T;
        id?: T;
      };
  externalProfileURL?: T;
  socialMedia?:
    | T
    | {
        instagram?: T;
        twitter?: T;
        spotify?: T;
        website?: T;
      };
  status?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags_select".
 */
export interface TagsSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  featured?: T;
  order?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "venues_select".
 */
export interface VenuesSelect<T extends boolean = true> {
  name?: T;
  address?: T;
  city?: T;
  capacity?: T;
  coordinates?:
    | T
    | {
        latitude?: T;
        longitude?: T;
      };
  description?: T;
  images?:
    | T
    | {
        image?: T;
        id?: T;
      };
  amenities?:
    | T
    | {
        name?: T;
        description?: T;
        id?: T;
      };
  parkingInfo?: T;
  status?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "concerts_select".
 */
export interface ConcertsSelect<T extends boolean = true> {
  title?: T;
  slug?: T;
  status?: T;
  tags?: T;
  startDate?: T;
  endDate?: T;
  venue?: T;
  artists?: T;
  poster?: T;
  ticketsLink?: T;
  schedule?:
    | T
    | {
        description?: T;
        images?:
          | T
          | {
              image?: T;
              id?: T;
            };
      };
  venueMaps?:
    | T
    | {
        image?: T;
        id?: T;
      };
  additionalInfo?:
    | T
    | {
        description?: T;
        images?:
          | T
          | {
              image?: T;
              id?: T;
            };
      };
  seo?:
    | T
    | {
        metaTitle?: T;
        metaDescription?: T;
        keywords?:
          | T
          | {
              keyword?: T;
              id?: T;
            };
        ogImage?: T;
        structuredData?:
          | T
          | {
              performerType?: T;
              eventStatus?: T;
              priceRange?: T;
              availability?: T;
            };
        canonicalUrl?: T;
        noIndex?: T;
      };
  trackingInfo?:
    | T
    | {
        eventCategory?: T;
        utmParameters?:
          | T
          | {
              source?: T;
              medium?: T;
              campaign?: T;
            };
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "setlists_select".
 */
export interface SetlistsSelect<T extends boolean = true> {
  name?: T;
  artist?: T;
  setlist?: T;
  setlistFmId?: T;
  setlistFmName?: T;
  playlistId?: T;
  playlistLinkToShare?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "third-party-access_select".
 */
export interface ThirdPartyAccessSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  enableAPIKey?: T;
  apiKey?: T;
  apiKeyIndex?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}