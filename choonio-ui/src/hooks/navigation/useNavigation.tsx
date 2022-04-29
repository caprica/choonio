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

import { useNavigate } from 'react-router-dom'
import {
    AlbumIdentity,
    ArtistIdentity,
    MediaIdentity,
    MediaType,
    PlaylistIdentity,
    TrackIdentity
} from '../../api/model/identity-model'
import { FavouritesGrouping } from '../settings/useFavouritesSettings'
import { PlaylistsGrouping } from '../settings/usePlaylistsSettings'
import { RecentsGrouping } from '../settings/useRecentsSettings'
import { TopPeriod, TopWhat } from '../settings/useTopStatsSettings'

/**
 * Hook providing common navigation functions.
 *
 * This is a simple wrapper around the browser history object, providing functions that encapsulate the necessary
 * client-side routing changes.
 */
export const useNavigation = () => {
    const navigate = useNavigate()

    // Top-level pages
    const gotoHome = () => navigate('/home')
    const gotoLibrary = () => navigate('/artists')
    const gotoPlaylists = () => navigate('/playlists')
    const gotoQueue = () => navigate('/queue')
    const gotoRecent = () => navigate('/recent')
    const gotoFavourites = () => navigate('/favourites')
    const gotoGenres = () => navigate('genres')
    const gotoStatistics = () => navigate('/stats')
    const gotoEqualizer = () => navigate('/equalizer')
    const gotoVisualisation = () => navigate('/visualisation')
    const gotoSettings = () => navigate('/settings')
    const gotoAbout = () => navigate('/about')

    // Detail pages
    const gotoArtist = (artistId: ArtistIdentity) => navigate(`/albums/${artistId.artistName}`)
    const gotoAlbum = (albumId: AlbumIdentity) => navigate(`/albums/${albumId.albumArtistName}/${albumId.albumName}`)
    const gotoTrack = (trackId: TrackIdentity) => navigate(`/albums/${trackId.albumArtistName}/${trackId.albumName}`)
    const gotoPlaylist = (playlistId: PlaylistIdentity) => navigate(`/playlist/${playlistId.playlistName}`)
    const gotoGenre = (genreName: string) => navigate(`/genres/${encodeURIComponent(genreName)}`)
    const gotoPlaylistEdit = (playlistId: PlaylistIdentity) => navigate(`/playlist/${playlistId.playlistName}/edit`)

    const gotoMedia = (mediaId: MediaIdentity) => {
        switch (mediaId.type) {
            case MediaType.Artist:
                gotoArtist(mediaId)
                break
            case MediaType.Album:
                gotoAlbum(mediaId)
                break
            case MediaType.Track:
                gotoTrack(mediaId)
                break
            case MediaType.Playlist:
                gotoPlaylist(mediaId)
                break
        }
    }

    const gotoFavouritesGroup = (group: FavouritesGrouping) => navigate(`/favourites/${group}`)
    const gotoRecentsGroup = (group: RecentsGrouping) => navigate(`/recent/${group}`)
    const gotoPlaylistsGroup = (group: PlaylistsGrouping) => navigate(`/playlists/${group}`)
    const gotoTopStats = (what: TopWhat, top: number, period: TopPeriod) => navigate(`/stats/top/${top}/${what}/${period}`)

    const gotoQuickSearch = (searchTerm: string) => navigate(`/search/${searchTerm}`)

    const goBack = () => history.back()

    return {
        gotoHome,
        gotoLibrary,
        gotoPlaylists,
        gotoQueue,
        gotoRecent,
        gotoFavourites,
        gotoGenres,
        gotoMedia,
        gotoStatistics,
        gotoEqualizer,
        gotoVisualisation,
        gotoSettings,
        gotoAbout,
        gotoArtist,
        gotoAlbum,
        gotoTrack,
        gotoGenre,
        gotoPlaylist,
        gotoPlaylistEdit,
        gotoFavouritesGroup,
        gotoRecentsGroup,
        gotoPlaylistsGroup,
        gotoTopStats,
        gotoQuickSearch,
        goBack
    }
}
