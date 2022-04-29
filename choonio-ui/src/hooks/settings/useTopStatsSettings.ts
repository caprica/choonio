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

import createPersistedState from 'use-persisted-state'

export enum TopWhat {
    Artists = 'artists',
    Albums = 'albums',
    Tracks = 'tracks'
}

export enum TopPeriod {
    AllTime = 'all-time',
    Today = 'today',
    Yesterday = 'yesterday',
    LastSevenDays = 'last-seven-days',
    ThisWeek = 'this-week',
    LastWeek = 'last-week',
    ThisMonth = 'this-month',
    ThisYear = 'this-year'
}

const periodCaptions = new Map()
periodCaptions.set(TopPeriod.AllTime, 'all time')
periodCaptions.set(TopPeriod.Today, 'today')
periodCaptions.set(TopPeriod.Yesterday, 'yesterday')
periodCaptions.set(TopPeriod.LastSevenDays, 'last seven days')
periodCaptions.set(TopPeriod.ThisWeek, 'this week')
periodCaptions.set(TopPeriod.LastWeek, 'last week')
periodCaptions.set(TopPeriod.ThisMonth, 'this month')
periodCaptions.set(TopPeriod.ThisYear, 'this year')

export const captionForTopPeriod = (value: string) => periodCaptions.get(value)

const DEFAULT_TOP_HOW_MANY = 10
const DEFAULT_TOP_WHAT = TopWhat.Artists
const DEFAULT_TOP_PERIOD = TopPeriod.AllTime

const useTopHowManyState = createPersistedState<number>('topHowMany')
const useTopWhatState = createPersistedState<TopWhat>('topWhat')
const useTopPeriodState = createPersistedState<TopPeriod>('topPeriod')

export const useTopStatsSettings = () => {
    const [topHowMany, setTopHowMany] = useTopHowManyState(DEFAULT_TOP_HOW_MANY)
    const [topWhat, setTopWhat] = useTopWhatState(DEFAULT_TOP_WHAT)
    const [topPeriod, setTopPeriod] = useTopPeriodState(DEFAULT_TOP_PERIOD)

    return {
        topHowMany,
        topWhat,
        topPeriod,
        setTopHowMany: (howMany: number) => setTopHowMany(howMany),
        setTopWhat: (what: TopWhat) => setTopWhat(what),
        setTopPeriod: (period: TopPeriod) => setTopPeriod(period)
    }
}
