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

import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import AboutPage from '../ui/pages/about/AboutPage'
import AlbumPage from '../ui/pages/album/AlbumPage'
import ArtistPage from '../ui/pages/artist/ArtistPage'
import ArtistsPage from '../ui/pages/artists/ArtistsPage'
import EditPlaylistPage from '../ui/pages/playlist-edit/EditPlaylistPage'
import EqualizerPage from '../ui/pages/equalizer/EqualizerPage'
import FavouritesPage from '../ui/pages/favourites/FavouritesPage'
import HomePage from '../ui/pages/home/HomePage'
import NotFoundPage from '../ui/pages/not-found/NotFoundPage'
import PlaylistsPage from '../ui/pages/playlists/PlaylistsPage'
import PlaylistPage from '../ui/pages/playlist/PlaylistPage'
import QueryPage from '../ui/pages/query/QueryPage'
import QueuePage from '../ui/pages/queue/QueuePage'
import RecentsPage from '../ui/pages/recents/RecentsPage'
import SearchPage from '../ui/pages/search/SearchPage'
import SettingsPage from '../ui/pages/settings/SettingsPage'
import StatsPage from '../ui/pages/stats/StatsPage'
import ViewTransition from './ViewTransition'

export default function MainContent() {
    const location = useLocation()

    return (
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<ViewTransition view={<HomePage />} />} />
            <Route path='/artists' element={<ViewTransition view={<ArtistsPage />} />} />
            <Route path='/albums/:artistName' element={<ViewTransition view={<ArtistPage />} />} />
            <Route path='/albums/:artistName/:albumName' element={<ViewTransition view={<AlbumPage />} />} />
            <Route path='/playlist/:playlistName' element={<ViewTransition view={<PlaylistPage />} />} />
            <Route path='/playlist/:playlistName/edit' element={<ViewTransition view={<EditPlaylistPage />} />} />
            <Route path='/queue' element={<ViewTransition view={<QueuePage />} />} />
            <Route path='/search/:query' element={<ViewTransition view={<SearchPage />} />} />
            <Route path='/about' element={<ViewTransition view={<AboutPage />} />} />
            <Route path='/settings/*' element={<ViewTransition view={<SettingsPage />} />} />
            <Route path='/stats/*' element={<ViewTransition view={<StatsPage />} />} />
            <Route path='/favourites/*' element={<ViewTransition view={<ViewTransition view={<FavouritesPage />} />} />} />
            <Route path='/playlists/*' element={<ViewTransition view={<PlaylistsPage />} />} />
            <Route path='/recent/*' element={<ViewTransition view={<RecentsPage />} />} />
            <Route path='/equalizer' element={<ViewTransition view={<EqualizerPage />} />} />
            <Route path='/query' element={<ViewTransition view={<QueryPage />} />} />
            <Route path='*' element={<ViewTransition view={<NotFoundPage />} />} />
        </Routes>
    )
}
