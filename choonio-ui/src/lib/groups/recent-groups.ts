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

import dayjs from 'dayjs'
import keys from 'lodash/keys'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import values from 'lodash/values'

import { RecentsGrouping } from '../../hooks/settings/useRecentsSettings'
import { RecentData } from '../../api/model/recents-model'
import { MediaType } from '../../api/model/identity-model'

export type RecentGrouping = {
    id: string
    name?: string
    recents: Array<RecentData>
}

export const getRecentGroups = (recents: Array<RecentData>, grouping: RecentsGrouping): Array<RecentGrouping> => {
    switch (grouping) {
        case RecentsGrouping.ByDate:
            return getRecentsByDate(recents)
        case RecentsGrouping.ByName:
            return getRecentsByName(recents)
        case RecentsGrouping.ByPeriod:
            return getRecentsByPeriod(recents)
        case RecentsGrouping.ByType:
            return getRecentsByType(recents)
    }
}

const getRecentsByDate = (recents: Array<RecentData>) => [{ id: 'date', recents }]

const getRecentsByName = (recents: Array<RecentData>) => [{ id: 'name', recents: sortBy(recents, sortByMediaId) }]

const sortByMediaId = (recent: RecentData) => {
    const mediaId = recent.mediaId
    switch (mediaId.type) {
        case MediaType.Artist:
            return mediaId.artistName
        case MediaType.Album:
            return mediaId.albumName
        case MediaType.Track:
            return mediaId.trackName
        case MediaType.Playlist:
            return mediaId.playlistName
    }
}

const getRecentsByPeriod = (recents: Array<RecentData>) => {
    const grouped = groupBy(recents, (recent: RecentData) => dayjs(recent.timestamp).startOf('day').toISOString())

    const days = keys(grouped)
    const dayRecents = values(grouped)

    const today = dayjs().startOf('day')
    const yesterday = today.subtract(1, 'day')
    const week = today.subtract(1, 'week')
    const month = today.subtract(1, 'month')

    let recentsToday: Array<RecentData> = []
    let recentsYesterday: Array<RecentData> = []
    let recentsLastWeek: Array<RecentData> = []
    let recentsLastMonth: Array<RecentData> = []
    let recentsLater: Array<RecentData> = []

    for (let i = 0; i < days.length; i++) {
        const day = dayjs(days[i])
        if (day.isSame(today)) {
            recentsToday = dayRecents[i]
        } else if (day.isSame(yesterday)) {
            recentsYesterday = dayRecents[i]
        } else if (day.isAfter(week)) {
            recentsLastWeek = recentsLastWeek.concat(dayRecents[i])
        } else if (day.isAfter(month)) {
            recentsLastMonth = recentsLastMonth.concat(dayRecents[i])
        } else {
            recentsLater = recentsLater.concat(dayRecents[i])
        }
    }

    return [
        { id: 'today', name: 'Today', recents: recentsToday },
        { id: 'yesterday', name: 'Yesterday', recents: recentsYesterday },
        { id: 'this-week', name: 'Earlier this week', recents: recentsLastWeek },
        { id: 'this-month', name: 'Earlier this month', recents: recentsLastMonth },
        { id: 'later', name: 'Later', recents: recentsLater }
    ]
}

const getRecentsByType = (recents: Array<RecentData>) => {
    const grouped = groupBy(recents, (recent: RecentData) => recent.mediaId.type)
    return [
        { id: 'arists', name: 'Artists', recents: grouped[MediaType.Artist] },
        { id: 'albums', name: 'Albums', recents: grouped[MediaType.Album] },
        { id: 'tracks', name: 'Tracks', recents: grouped[MediaType.Track] },
        { id: 'playlists', name: 'Playlists', recents: grouped[MediaType.Playlist] }
    ]
}
