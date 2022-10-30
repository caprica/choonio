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

import makeStyles from '@mui/styles/makeStyles'
import Container from '@mui/material/Container'

import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import PlaylistsNav from '../../../ui/pages/playlists/PlaylistsNav'
import { PlaylistsGrouping, usePlaylistsSettings } from '../../../hooks/settings/usePlaylistsSettings'
import { useGetPlaylists } from '../../../api/endpoints/playlists-controller'
import { getPlaylistGroups } from '../../../lib/groups/playlist-groups'
import PlaylistsGroup from './PlaylistsGroup'
import invariant from 'tiny-invariant'

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

    const { playlistsGroup } = usePlaylistsSettings()

    return (
        <Container maxWidth='xl' className={classes.root}>
            <Routes>
                <Route path=':grouping' element={<PlaylistsNav />} />
            </Routes>
            <Routes>
                <Route path='' element={<Navigate to={playlistsGroup} replace />} />
                <Route path=':grouping' element={<Content />} />
            </Routes>
        </Container>
    )
}

type ParamTypes = {
    grouping: PlaylistsGrouping
}

const Content = () => {
    const { grouping } = useParams<ParamTypes>()
    invariant(grouping)

    const { data: playlists } = useGetPlaylists()

    if (!playlists) return null

    const groups = getPlaylistGroups(playlists, grouping)
    return (
        <div>
            {groups.map(group => (
                <PlaylistsGroup key={group.id} caption={group.name} playlists={group.playlists} />
            ))}
        </div>
    )
}
