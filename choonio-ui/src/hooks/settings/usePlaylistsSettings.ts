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

import createPersistedState from 'use-persisted-state'
import { PlaylistGrouping } from '../../lib/groups/playlist-groups'

export enum PlaylistsGrouping {
    ByRecentlyCreated = 'by-recently-created',
    ByRecentlyModified = 'by-recently-modified',
    ByName = 'by-name',
    ByDuration = 'by-duration'
}

const captions = new Map()
captions.set(PlaylistsGrouping.ByRecentlyCreated, 'by recently created')
captions.set(PlaylistsGrouping.ByRecentlyModified, 'by recently modified')
captions.set(PlaylistsGrouping.ByName, 'by name')
captions.set(PlaylistsGrouping.ByDuration, 'by duration')

export const captionForPlaylistsGrouping = (value: string) => captions.get(value)

const DEFAULT_PLAYLISTS_GROUP = PlaylistsGrouping.ByRecentlyCreated

const usePlaylistsGroupState = createPersistedState<PlaylistsGrouping>('playlistsGroup')

export const usePlaylistsSettings = () => {
    const [playlistsGroup, setPlaylistsGroup] = usePlaylistsGroupState(DEFAULT_PLAYLISTS_GROUP)

    return {
        playlistsGroup,
        setPlaylistsGroup: (group: PlaylistsGrouping) => setPlaylistsGroup(group)
    }
}
