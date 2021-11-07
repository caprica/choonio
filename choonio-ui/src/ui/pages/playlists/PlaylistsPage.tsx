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

import makeStyles from '@mui/styles/makeStyles'
import Container from '@mui/material/Container'

import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import PlaylistsNav from '../../../ui/pages/playlists/PlaylistsNav'
import { PlaylistsGrouping, usePlaylistsSettings } from '../../../hooks/settings/usePlaylistsSettings'
import { useGetPlaylists } from '../../../api/endpoints/playlists-controller'
import TransitionRoute from '../../../main/TransitionRoute'
import { getPlaylistGroups } from '../../../lib/groups/playlist-groups'
import PlaylistsGroup from './PlaylistsGroup'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    }
}))

export interface PlaylistsParams {
    grouping: string
}

export default function PlaylistsPage() {
    const classes = useStyles()

    const match = useRouteMatch()

    const { playlistsGroup } = usePlaylistsSettings()

    return (
        <Container maxWidth='xl' className={classes.root}>
            <Route path={`${match.path}/:grouping`}>
                <PlaylistsNav />
            </Route>
            <Switch>
                <Route exact path={`${match.url}`}>
                    <Redirect to={`/playlists/${playlistsGroup}`} />
                </Route>
                <TransitionRoute exact path={`${match.path}/:grouping`} component={Content} />
            </Switch>
        </Container>
    )
}

const Content = () => {
    const { grouping } = useParams<PlaylistsParams>()

    const { data: playlists } = useGetPlaylists()

    if (!playlists) return null

    const groups = getPlaylistGroups(playlists, grouping as PlaylistsGrouping)
    return (
        <div>
            {groups.map(group => (
                <PlaylistsGroup key={group.id} caption={group.name} playlists={group.playlists} />
            ))}
        </div>
    )
}
