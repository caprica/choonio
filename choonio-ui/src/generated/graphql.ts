import { useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:8080/graphql", {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Album = {
  __typename?: 'Album';
  albumArtistName?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  genre?: Maybe<Scalars['String']>;
  mediaId?: Maybe<AlbumId>;
  name?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<AlbumTrack>>>;
  year?: Maybe<Scalars['Int']>;
};

export type AlbumId = {
  __typename?: 'AlbumId';
  albumArtistName?: Maybe<Scalars['String']>;
  albumName?: Maybe<Scalars['String']>;
};

export type AlbumTrack = {
  __typename?: 'AlbumTrack';
  artistName?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  mediaId?: Maybe<TrackId>;
  number?: Maybe<Scalars['Int']>;
  stats?: Maybe<TrackStats>;
};

export type Artist = {
  __typename?: 'Artist';
  mediaId?: Maybe<ArtistId>;
  name?: Maybe<Scalars['String']>;
};

export type ArtistId = {
  __typename?: 'ArtistId';
  artistName?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  album?: Maybe<Album>;
  albums?: Maybe<Array<Maybe<Album>>>;
  albumsByArtist?: Maybe<Array<Maybe<Album>>>;
  artists?: Maybe<Array<Maybe<Artist>>>;
};


export type QueryAlbumArgs = {
  albumName?: InputMaybe<Scalars['String']>;
  artistName?: InputMaybe<Scalars['String']>;
};


export type QueryAlbumsByArtistArgs = {
  artistName?: InputMaybe<Scalars['String']>;
};

export enum Rating {
  Neutral = 'NEUTRAL',
  ThumbsDown = 'THUMBS_DOWN',
  ThumbsUp = 'THUMBS_UP'
}

export type TrackId = {
  __typename?: 'TrackId';
  albumArtistName?: Maybe<Scalars['String']>;
  albumName?: Maybe<Scalars['String']>;
  trackName?: Maybe<Scalars['String']>;
};

export type TrackStats = {
  __typename?: 'TrackStats';
  listens?: Maybe<Scalars['Int']>;
  rating?: Maybe<Rating>;
};

export type GetArtistsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetArtistsQuery = { __typename?: 'Query', artists?: Array<{ __typename?: 'Artist', mediaId?: { __typename?: 'ArtistId', artistName?: string | null } | null } | null> | null };

export type GetAlbumsByArtistQueryVariables = Exact<{
  artistName?: InputMaybe<Scalars['String']>;
}>;


export type GetAlbumsByArtistQuery = { __typename?: 'Query', albumsByArtist?: Array<{ __typename?: 'Album', name?: string | null, year?: number | null, genre?: string | null, duration?: number | null, mediaId?: { __typename?: 'AlbumId', albumArtistName?: string | null, albumName?: string | null } | null, tracks?: Array<{ __typename?: 'AlbumTrack', number?: number | null, artistName?: string | null, duration?: number | null, mediaId?: { __typename?: 'TrackId', albumArtistName?: string | null, albumName?: string | null, trackName?: string | null } | null, stats?: { __typename?: 'TrackStats', listens?: number | null, rating?: Rating | null } | null } | null> | null } | null> | null };


export const GetArtistsDocument = `
    query GetArtists {
  artists {
    mediaId {
      artistName
    }
  }
}
    `;
export const useGetArtistsQuery = <
      TData = GetArtistsQuery,
      TError = unknown
    >(
      variables?: GetArtistsQueryVariables,
      options?: UseQueryOptions<GetArtistsQuery, TError, TData>
    ) =>
    useQuery<GetArtistsQuery, TError, TData>(
      variables === undefined ? ['GetArtists'] : ['GetArtists', variables],
      fetcher<GetArtistsQuery, GetArtistsQueryVariables>(GetArtistsDocument, variables),
      options
    );
export const GetAlbumsByArtistDocument = `
    query GetAlbumsByArtist($artistName: String) {
  albumsByArtist(artistName: $artistName) {
    mediaId {
      albumArtistName
      albumName
    }
    name
    year
    genre
    duration
    tracks {
      number
      mediaId {
        albumArtistName
        albumName
        trackName
      }
      artistName
      duration
      stats {
        listens
        rating
      }
    }
  }
}
    `;
export const useGetAlbumsByArtistQuery = <
      TData = GetAlbumsByArtistQuery,
      TError = unknown
    >(
      variables?: GetAlbumsByArtistQueryVariables,
      options?: UseQueryOptions<GetAlbumsByArtistQuery, TError, TData>
    ) =>
    useQuery<GetAlbumsByArtistQuery, TError, TData>(
      variables === undefined ? ['GetAlbumsByArtist'] : ['GetAlbumsByArtist', variables],
      fetcher<GetAlbumsByArtistQuery, GetAlbumsByArtistQueryVariables>(GetAlbumsByArtistDocument, variables),
      options
    );