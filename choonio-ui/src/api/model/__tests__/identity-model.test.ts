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
 *
 * Copyright 2021-2022 Caprica Software Limited
 */

import {
    AlbumIdentity,
    albumIdToArtistId,
    ArtistIdentity,
    artistNameToArtistId,
    captionForMediaId,
    keyForMediaId,
    MediaIdentity,
    MediaType,
    TrackIdentity,
    trackIdToAlbumId,
    trackIdToArtistId
} from '../identity-model'

describe('Convert media identity', () => {
    it('converts album id to artist id', () => {
        const albumId: AlbumIdentity = { type: MediaType.Album, albumArtistName: 'DEADLIFE', albumName: 'God in the Machine' }

        const artistId: ArtistIdentity = {
            type: MediaType.Artist,
            artistName: 'DEADLIFE'
        }

        expect(albumIdToArtistId(albumId)).toEqual(artistId)
    })

    it('converts track id to artist id', () => {
        const trackId: TrackIdentity = {
            type: MediaType.Track,
            albumArtistName: 'STRNGR & Destryur',
            albumName: 'Night at the Grindhouse',
            trackName: 'Corpse Boogie'
        }

        const artistId: ArtistIdentity = {
            type: MediaType.Artist,
            artistName: 'STRNGR & Destryur'
        }

        expect(trackIdToArtistId(trackId)).toEqual(artistId)
    })

    it('converts track id to album id', () => {
        const trackId: TrackIdentity = {
            type: MediaType.Track,
            albumArtistName: 'STRNGR & Destryur',
            albumName: 'Night at the Grindhouse',
            trackName: 'Corpse Boogie'
        }

        const albumId: AlbumIdentity = {
            type: MediaType.Album,
            albumArtistName: 'STRNGR & Destryur',
            albumName: 'Night at the Grindhouse'
        }

        expect(trackIdToAlbumId(trackId)).toEqual(albumId)
    })

    it('converts artist name to artist id', () => {
        const artistName = 'Signal Void'

        const artistId: ArtistIdentity = {
            type: MediaType.Artist,
            artistName: 'Signal Void'
        }

        expect(artistNameToArtistId(artistName)).toEqual(artistId)
    })
})

describe('Caption for media identity', () => {
    it('returns caption for artist', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Artist,
            artistName: 'Midnight Danger'
        }

        expect(captionForMediaId(mediaId)).toEqual('Midnight Danger')
    })

    it('returns caption for album', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Album,
            albumArtistName: 'Fury Weekend',
            albumName: 'Escape From Neon City'
        }

        expect(captionForMediaId(mediaId)).toEqual('Escape From Neon City')
    })

    it('returns caption for track', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Track,
            albumArtistName: 'NINA',
            albumName: 'Synthian',
            trackName: 'Unnoticed'
        }

        expect(captionForMediaId(mediaId)).toEqual('Unnoticed')
    })

    it('returns caption for playlist', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Playlist,
            playlistName: 'Synthwave is the Bestwave'
        }

        expect(captionForMediaId(mediaId)).toEqual('Synthwave is the Bestwave')
    })
})

describe('Key for media identity', () => {
    it('returns key for artist', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Artist,
            artistName: 'Midnight Danger'
        }

        expect(keyForMediaId(mediaId)).toEqual('Midnight Danger|ARTIST')
    })

    it('returns key for album', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Album,
            albumArtistName: 'Fury Weekend',
            albumName: 'Escape From Neon City'
        }

        expect(keyForMediaId(mediaId)).toEqual('Escape From Neon City|Fury Weekend|ALBUM')
    })

    it('returns key for track', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Track,
            albumArtistName: 'NINA',
            albumName: 'Synthian',
            trackName: 'Unnoticed'
        }

        expect(keyForMediaId(mediaId)).toEqual('Unnoticed|Synthian|NINA|TRACK')
    })

    it('returns key for playlist', () => {
        const mediaId: MediaIdentity = {
            type: MediaType.Playlist,
            playlistName: 'Synthwave is the Bestwave'
        }

        expect(keyForMediaId(mediaId)).toEqual('Synthwave is the Bestwave|PLAYLIST')
    })
})
