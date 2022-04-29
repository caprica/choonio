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

import { ArtSize } from '../api/model/art-model'
import { MediaType } from '../api/model/identity-model'
import { API_DATE_FORMAT } from '../lib/date-format/date-format'
import { DateRange } from '../lib/date-ranges/date-ranges'

const searchLimit = 100

export function artistsUrl() {
    return '/api/artists'
}

export function albumsUrl(artist: string): string
export function albumsUrl(artist: string, title: string): string
export function albumsUrl(artist: string, title?: string) {
    if (!title) return `/api/albums/${encodeURIComponent(artist)}`
    return `/api/albums/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
}

export function tracksUrl() {
    return '/api/tracks'
}

export function albumCoverUrl(artist: string, title: string, size: ArtSize) {
    return `/api/albums/${encodeURIComponent(artist)}/${encodeURIComponent(title)}/cover-${size}.jpg`
}

export function artistCoverUrl(artist: string, size: ArtSize) {
    return `/api/artists/${encodeURIComponent(artist)}/cover-${size}.jpg`
}

export function playlistCoverUrl(playlist: string, size: ArtSize) {
    return `/api/playlists/${encodeURIComponent(playlist)}/cover-${size}.jpg`
}

export function genreCoverUrl(genre: string, size: ArtSize) {
    return `/api/genres/${encodeURIComponent(genre)}/cover-${size}.jpg`
}

export function genresUrl(): string
export function genresUrl(genre: string): string
export function genresUrl(genre?: string) {
    if (!genre) return '/api/genres'
    return `/api/genres/${encodeURIComponent(genre)}`
}

export function queueUrl(): string
export function queueUrl(id: string): string
export function queueUrl(id?: string) {
    if (!id) return '/api/queue'
    return `/api/queue/${id}`
}

export function recentsUrl(): string
export function recentsUrl(id: string): string
export function recentsUrl(id?: string) {
    if (!id) return '/api/recent'
    return `/api/recent/${id}`
}

export function favouritesUrl(): string
export function favouritesUrl(id: string): string
export function favouritesUrl(id?: string) {
    if (!id) return '/api/favourites'
    return `/api/favourites/${id}`
}

export function playlistsUrl(): string
export function playlistsUrl(playlist: string): string
export function playlistsUrl(playlist: string, id: string): string
export function playlistsUrl(playlist?: string, id?: string) {
    if (!playlist) return '/api/playlists'
    if (!id) return `/api/playlists/${encodeURIComponent(playlist)}`
    return `/api/playlists/${encodeURIComponent(playlist)}/${id}`
}

export function playlistsNamesUrl(): string {
    return '/api/playlists?format=names'
}

export function autoPlaylistsUrl(): string
export function autoPlaylistsUrl(autoPlaylist: string): string
export function autoPlaylistsUrl(autoPlaylist: string, id: string): string
export function autoPlaylistsUrl(autoPlaylist?: string, id?: string) {
    if (!autoPlaylist) return '/api/auto-playlists'
    if (!id) return `/api/auto-playlists/${encodeURIComponent(autoPlaylist)}`
    return `/api/auto-playlists/${encodeURIComponent(autoPlaylist)}/${id}`
}

export function autoPlaylistsNamesUrl(): string {
    return '/api/auto-playlists?format=names'
}

export function recentPlaylistsUrl(): string {
    return `/api/recent?type=${MediaType.Playlist}`
}

export function quickSearchUrl(query: string) {
    return `/api/search/quick?q=${query}&limit=${searchLimit}`
}

export function adminUrl(fn: string) {
    return `/api/admin/${fn}`
}

export function topArtistsUrl(limit: number): string
export function topArtistsUrl(limit: number, range?: DateRange): string
export function topArtistsUrl(limit: number, range?: DateRange) {
    let url = `/api/plays/artists?limit=${limit}`
    if (range) url += `&from=${range.fromInclusive.format(API_DATE_FORMAT)}&to=${range.toExclusive.format(API_DATE_FORMAT)}`
    return url
}

export function topAlbumsUrl(limit: number): string
export function topAlbumsUrl(limit: number, range?: DateRange): string
export function topAlbumsUrl(limit: number, range?: DateRange) {
    let url = `/api/plays/albums?limit=${limit}`
    if (range) url += `&from=${range.fromInclusive.format(API_DATE_FORMAT)}&to=${range.toExclusive.format(API_DATE_FORMAT)}`
    return url
}

export function topTracksUrl(limit: number): string
export function topTracksUrl(limit: number, range?: DateRange): string
export function topTracksUrl(limit: number, range?: DateRange) {
    let url = `/api/plays/tracks?limit=${limit}`
    if (range) url += `&from=${range.fromInclusive.format(API_DATE_FORMAT)}&to=${range.toExclusive.format(API_DATE_FORMAT)}`
    return url
}

export function playerControlsUrl() {
    return '/api/player/controls'
}

export function equalizerUrl() {
    return '/api/equalizer'
}

export function equalizerAmpsUrl() {
    return '/api/equalizer/amps'
}

export function equalizerPresetsUrl() {
    return '/api/equalizer/presets'
}

export function rateTrackUrl(artist: string, album: string, track: string) {
    return `/api/ratings/${encodeURIComponent(artist)}/${encodeURIComponent(album)}/${encodeURIComponent(track)}`
}

export function highlightsUrl() {
    return '/api/highlights'
}

export function configurationUrl() {
    return '/api/configuration'
}

export function listensByArtistUrl(minimumListens: number, fromDateInclusive?: string, toDateExclusive?: string) {
    let url = `/api/statistics/listens/by-artist?min=${minimumListens}`
    if (fromDateInclusive) {
        // url += `&from=${fromDateInclusive.format(API_DATE_FORMAT)}`
        url += `&from=${fromDateInclusive}`
    }
    if (toDateExclusive) {
        // url += `&to=${toDateExclusive.format(API_DATE_FORMAT)}`
        url += `&to=${toDateExclusive}`
    }
    return url
}

export const eventsUrl = () => 'http://localhost:8080/api/events'
