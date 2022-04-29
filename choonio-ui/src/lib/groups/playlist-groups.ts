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

import sortBy from 'lodash/sortBy'
import orderBy from 'lodash/orderBy'
import inRange from 'lodash/inRange'
import { PlaylistData } from '../../api/model/playlists-model'
import { PlaylistsGrouping } from '../../hooks/settings/usePlaylistsSettings'

export type PlaylistGrouping = {
    id: string
    name?: string
    playlists: Array<PlaylistData>
}

export const getPlaylistGroups = (playlists: Array<PlaylistData>, grouping: PlaylistsGrouping): Array<PlaylistGrouping> => {
    switch (grouping) {
        case PlaylistsGrouping.ByRecentlyCreated:
            return getPlaylistsByRecentlyCreated(playlists)
        case PlaylistsGrouping.ByRecentlyModified:
            return getPlaylistsByRecentlyModified(playlists)
        case PlaylistsGrouping.ByName:
            return getPlaylistsByName(playlists)
        case PlaylistsGrouping.ByDuration:
            return getPlaylistsByDuration(playlists)
    }
}

const getPlaylistsByRecentlyCreated = (playlists: Array<PlaylistData>) => [
    { id: 'recently-created', playlists: orderBy(playlists, p => p.created, 'desc') }
]

const getPlaylistsByRecentlyModified = (playlists: Array<PlaylistData>) => [
    { id: 'recently-modified', playlists: orderBy(playlists, p => p.updated, 'desc') }
]

const getPlaylistsByName = (playlists: Array<PlaylistData>) => [
    { id: 'name', playlists: sortBy(playlists, p => p.mediaId.playlistName) }
]

const getPlaylistsByDuration = (playlists: Array<PlaylistData>) => {
    // Likely scope to improve this implementation

    const buckets = [
        { value: 0, caption: '' },
        { value: 30, caption: '30 minutes or less' },
        { value: 60, caption: '1 hour or less' },
        { value: 120, caption: '2 hours or less' },
        { value: 180, caption: '3 hours or less' },
        { value: 240, caption: '4 hours or less' },
        { value: -1, caption: 'Over 4 hours' }
    ]

    const grouped = buckets.reduce((acc, bucket) => {
        if (bucket.value !== 0) acc.set(bucket.value, [])
        return acc
    }, new Map<number, Array<PlaylistData>>())

    for (const playlist of playlists) {
        const duration = playlist.duration / 60
        let found = -1
        for (let i = 0; i < buckets.length - 1; i++) {
            if (inRange(duration, buckets[i].value, buckets[i + 1].value)) {
                found = buckets[i + 1].value
                break
            }
        }
        grouped.get(found)?.push(playlist)
    }

    const result = []
    for (const bucket of buckets) {
        if (bucket.value !== 0) {
            result.push({ id: bucket.caption, name: bucket.caption, playlists: grouped.get(bucket.value) || [] })
        }
    }
    return result
}
