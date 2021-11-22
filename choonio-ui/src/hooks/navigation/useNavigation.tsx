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

import { useHistory } from 'react-router-dom'
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
    const history = useHistory()

    // Top-level pages
    const gotoHome = () => history.push('/home')
    const gotoLibrary = () => history.push('/artists')
    const gotoPlaylists = () => history.push('/playlists')
    const gotoQueue = () => history.push('/queue')
    const gotoRecent = () => history.push('/recent')
    const gotoFavourites = () => history.push('/favourites')
    const gotoGenres = () => history.push('genres')
    const gotoStatistics = () => history.push('/stats')
    const gotoVisualisation = () => history.push('/visualisation')
    const gotoSettings = () => history.push('/settings')
    const gotoAbout = () => history.push('/about')

    // Detail pages
    const gotoArtist = (artistId: ArtistIdentity) => history.push(`/albums/${artistId.artistName}`)
    const gotoAlbum = (albumId: AlbumIdentity) => history.push(`/albums/${albumId.albumArtistName}/${albumId.albumName}`)
    const gotoTrack = (trackId: TrackIdentity) => history.push(`/albums/${trackId.albumArtistName}/${trackId.albumName}`)
    const gotoPlaylist = (playlistId: PlaylistIdentity) => history.push(`/playlist/${playlistId.playlistName}`)
    const gotoGenre = (genreName: string) => history.push(`/genres/${encodeURIComponent(genreName)}`)
    const gotoPlaylistEdit = (playlistId: PlaylistIdentity) => history.push(`/playlist/${playlistId.playlistName}/edit`)

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

    const gotoFavouritesGroup = (group: FavouritesGrouping) => history.push(`/favourites/${group}`)
    const gotoRecentsGroup = (group: RecentsGrouping) => history.push(`/recent/${group}`)
    const gotoPlaylistsGroup = (group: PlaylistsGrouping) => history.push(`/playlists/${group}`)
    const gotoTopStats = (what: TopWhat, top: number, period: TopPeriod) => history.push(`/stats/top/${top}/${what}/${period}`)

    const gotoQuickSearch = (searchTerm: string) => history.push(`/search/${searchTerm}`)

    const goBack = () => history.goBack()

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
