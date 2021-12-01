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

import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import TransitionRoute from './TransitionRoute'

import AboutPage from '../ui/pages/about/AboutPage'
import AlbumPage from '../ui/pages/album/AlbumPage'
import ArtistPage from '../ui/pages/artist/ArtistPage'
import ArtistsPage from '../ui/pages/artists/ArtistsPage'
import EditPlaylistPage from '../ui/pages/playlist-edit/EditPlaylistPage'
import EqualizerPage from '../ui/pages/equalizer/EqualizerPage'
import ExpoPage from '../ui/pages/expo/ExpoPage'
import FavouritesPage from '../ui/pages/favourites/FavouritesPage'
import HomePage from '../ui/pages/home/HomePage'
import NotFoundPage from '../ui/pages/not-found/NotFoundPage'
import PlaylistsPage from '../ui/pages/playlists/PlaylistsPage'
import PlaylistPage from '../ui/pages/playlist/PlaylistPage'
import QueuePage from '../ui/pages/queue/QueuePage'
import RecentsPage from '../ui/pages/recents/RecentsPage'
import SearchPage from '../ui/pages/search/SearchPage'
import SettingsPage from '../ui/pages/settings/SettingsPage'
import StatsPage from '../ui/pages/stats/StatsPage'

export default function MainContent() {
    const location = useLocation()

    return (
        <Switch location={location} key={location.pathname}>
            <Route exact path='/'>
                <Redirect to='/home' />
            </Route>
            <TransitionRoute exact path='/home' component={HomePage} />
            <TransitionRoute exact path='/expo' component={ExpoPage} />
            <TransitionRoute exact path='/artists' component={ArtistsPage} />
            <TransitionRoute exact path='/albums/:artistName' component={ArtistPage} />
            <TransitionRoute exact path='/albums/:artistName/:albumName' component={AlbumPage} />
            <TransitionRoute exact path='/playlist/:playlistName' component={PlaylistPage} />
            <TransitionRoute exact path='/playlist/:playlistName/edit' component={EditPlaylistPage} />
            <TransitionRoute exact path='/queue' component={QueuePage} />
            <TransitionRoute exact path='/search/:query' component={SearchPage} />
            <TransitionRoute exact path='/about' component={AboutPage} />
            <TransitionRoute path='/settings' component={SettingsPage} />
            <TransitionRoute path='/stats' component={StatsPage} />
            <TransitionRoute path='/favourites' component={FavouritesPage} />
            <TransitionRoute path='/playlists' component={PlaylistsPage} />
            <TransitionRoute path='/recent' component={RecentsPage} />
            <TransitionRoute path='/equalizer' component={EqualizerPage} />
            <TransitionRoute component={NotFoundPage} />
        </Switch>
    )
}
