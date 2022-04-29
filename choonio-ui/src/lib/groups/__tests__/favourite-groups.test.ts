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

import dayjs from 'dayjs'
import { FavouriteData } from '../../../api/model/favourites-model'
import { MediaType } from '../../../api/model/identity-model'
import { FavouritesGrouping } from '../../../hooks/settings/useFavouritesSettings'
import { FavouriteGrouping, getFavouriteGroups } from '../favourite-groups'

const favourites: Array<FavouriteData> = [
    {
        id: '1',
        mediaId: { playlistName: 'W O L F C L U B - Just Drive', type: MediaType.Playlist },
        timestamp: dayjs('2021-11-02T15:44:00.544Z').unix()
    },
    {
        id: '2',
        mediaId: {
            albumArtistName: 'Midnight Danger',
            albumName: 'Chapter 2: Endless Nightmare',
            trackName: 'One Last Goodbye',
            type: MediaType.Track
        },
        timestamp: dayjs('2021-08-22T17:24:37.021Z').unix()
    },
    {
        id: '3',
        mediaId: { albumArtistName: 'Fury Weekend', albumName: 'Escape From Neon City', type: MediaType.Album },
        timestamp: dayjs('2021-08-15T17:48:23.860Z').unix()
    },
    {
        id: '4',
        mediaId: {
            albumArtistName: 'W O L F C L U B',
            albumName: 'Just Drive - Part 2',
            trackName: 'Flashbacks (feat. Dora Pereli)',
            type: MediaType.Track
        },
        timestamp: dayjs('2021-08-15T12:37:15.323Z').unix()
    },
    {
        id: '5',
        mediaId: { artistName: 'Dana Jean Phoenix', type: MediaType.Artist },
        timestamp: dayjs('2021-03-28T09:05:59.648Z').unix()
    },
    {
        id: '6',
        mediaId: { artistName: 'Cobra Wipeout', type: MediaType.Artist },
        timestamp: dayjs('2021-03-28T09:02:45.873Z').unix()
    },
    {
        id: '7',
        mediaId: { albumArtistName: 'Midnight Danger', albumName: 'Malignant Force', type: MediaType.Album },
        timestamp: dayjs('2021-03-27T18:16:57.617Z').unix()
    }
]

it('groups by date', () => {
    const result: Array<FavouriteGrouping> = getFavouriteGroups(favourites, FavouritesGrouping.ByDate)
    // Export more things
    expect(result.length).toBe(1)
})

it('groups by name', () => {
    const result: Array<FavouriteGrouping> = getFavouriteGroups(favourites, FavouritesGrouping.ByName)
    // Export more things
    expect(result.length).toBe(1)
})

it('groups by type', () => {
    const result: Array<FavouriteGrouping> = getFavouriteGroups(favourites, FavouritesGrouping.ByType)
    // Export more things
    expect(result.length).toBe(4)
})
