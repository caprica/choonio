/*
 * This file is part of Choonio.
 *
 * Choonio is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * Choonio is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Choonio.  If not, see <https://www.gnu.org/licenses/>.
 */

export type MediaIdentity = ArtistIdentity | AlbumIdentity | TrackIdentity | PlaylistIdentity

export interface ArtistIdentity {
    readonly type: MediaType.Artist
    readonly artistName: string
}

export interface AlbumIdentity {
    readonly type: MediaType.Album
    readonly albumArtistName: string
    readonly albumName: string
}

export interface TrackIdentity {
    readonly type: MediaType.Track
    readonly albumArtistName: string
    readonly albumName: string
    readonly trackName: string
}

export interface PlaylistIdentity {
    readonly type: MediaType.Playlist
    readonly playlistName: string
}

export enum MediaType {
    Artist = 'ARTIST',
    Album = 'ALBUM',
    Track = 'TRACK',
    Playlist = 'PLAYLIST'
}

export const albumIdToArtistId = (albumId: AlbumIdentity): ArtistIdentity => ({
    type: MediaType.Artist,
    artistName: albumId.albumArtistName
})

export const trackIdToArtistId = (trackId: TrackIdentity): ArtistIdentity => ({
    type: MediaType.Artist,
    artistName: trackId.albumArtistName
})

export const trackIdToAlbumId = (trackId: TrackIdentity): AlbumIdentity => ({
    type: MediaType.Album,
    albumArtistName: trackId.albumArtistName,
    albumName: trackId.albumName
})

export const artistNameToArtistId = (artistName: string): ArtistIdentity => ({
    type: MediaType.Artist,
    artistName
})

export const captionForMediaId = (mediaId: MediaIdentity) => {
    switch (mediaId.type) {
        case MediaType.Artist:
            return mediaId.artistName
        case MediaType.Album:
            return mediaId.albumName
        case MediaType.Track:
            return mediaId.trackName
        case MediaType.Playlist:
            return mediaId.playlistName
    }
}

export const keyForMediaId = (mediaId: MediaIdentity) => {
    switch (mediaId.type) {
        case MediaType.Artist:
            return `${mediaId.artistName}|${mediaId.type}`
        case MediaType.Album:
            return `${mediaId.albumName}|${mediaId.albumArtistName}|${mediaId.type}`
        case MediaType.Track:
            return `${mediaId.trackName}|${mediaId.albumName}|${mediaId.albumArtistName}|${mediaId.type}`
        case MediaType.Playlist:
            return `${mediaId.playlistName}|${mediaId.type}`
    }
}
