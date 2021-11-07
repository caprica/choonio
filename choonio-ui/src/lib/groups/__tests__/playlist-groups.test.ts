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

import { MediaType } from '../../../api/model/identity-model'
import { PlaylistData } from '../../../api/model/playlists-model'
import { PlaylistsGrouping } from '../../../hooks/settings/usePlaylistsSettings'
import { getPlaylistGroups, PlaylistGrouping } from '../playlist-groups'

const playlists: Array<PlaylistData> = [
    {
        id: '1',
        mediaId: { type: MediaType.Playlist, playlistName: 'Synthwave' },
        description: 'The best wave',
        items: [],
        duration: 3601,
        created: '2021-10-13T10:20:30.123Z',
        updated: '2021-10-28T08:59:24.314Z'
    },
    {
        id: '2',
        mediaId: { type: MediaType.Playlist, playlistName: 'More Synthwave' },
        description: 'Even more of the best wave',
        items: [],
        duration: 3599,
        created: '2021-10-13T17:24:32.442Z',
        updated: '2021-10-27T18:10:42.874Z'
    }
]

it('groups by recently created', () => {
    const result: Array<PlaylistGrouping> = getPlaylistGroups(playlists, PlaylistsGrouping.ByRecentlyCreated)
    // Export more things
    expect(result.length).toBe(1)
})

it('groups by recently modified', () => {
    const result: Array<PlaylistGrouping> = getPlaylistGroups(playlists, PlaylistsGrouping.ByRecentlyModified)
    // Export more things
    expect(result.length).toBe(1)
})

it('groups by name', () => {
    const result: Array<PlaylistGrouping> = getPlaylistGroups(playlists, PlaylistsGrouping.ByName)
    // Export more things
    expect(result.length).toBe(1)
})

it('groups by duration', () => {
    const result: Array<PlaylistGrouping> = getPlaylistGroups(playlists, PlaylistsGrouping.ByDuration)
    // Export more things
    expect(result.length).toBe(6)
})
