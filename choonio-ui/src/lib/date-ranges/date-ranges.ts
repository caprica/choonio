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

import dayjs, { Dayjs } from 'dayjs'
import { TopPeriod } from '../../hooks/settings/useTopStatsSettings'

export type DateRange = {
    fromInclusive: Dayjs
    toExclusive: Dayjs
}

export const today = (): DateRange => ({
    fromInclusive: dayjs().startOf('day'),
    toExclusive: dayjs().startOf('day').add(1, 'day')
})

export const yesterday = (): DateRange => ({
    fromInclusive: dayjs().startOf('day').subtract(1, 'day'),
    toExclusive: dayjs().startOf('day')
})

export const lastSevenDays = (): DateRange => ({
    fromInclusive: dayjs().startOf('day').subtract(6, 'days'),
    toExclusive: dayjs().add(1, 'day').startOf('day')
})

export const pastMonth = (): DateRange => ({
    fromInclusive: dayjs().startOf('day').subtract(1, 'month'),
    toExclusive: dayjs().add(1, 'day').startOf('day')
})

export const pastTwelveMonths = (): DateRange => ({
    fromInclusive: dayjs().startOf('day').subtract(1, 'year'),
    toExclusive: dayjs().add(1, 'day').startOf('day')
})

export const thisWeek = (): DateRange => ({
    fromInclusive: dayjs().startOf('week'),
    toExclusive: dayjs().startOf('week').add(1, 'week')
})

export const lastWeek = (): DateRange => ({
    fromInclusive: dayjs().startOf('week').subtract(1, 'week'),
    toExclusive: dayjs().startOf('week')
})

export const thisMonth = (): DateRange => ({
    fromInclusive: dayjs().startOf('month'),
    toExclusive: dayjs().startOf('month').add(1, 'month')
})

export const thisYear = (): DateRange => ({
    fromInclusive: dayjs().startOf('year'),
    toExclusive: dayjs().startOf('year').add(1, 'year')
})

export const dateRangeForPeriod = (period: string) => {
    switch (period as TopPeriod) {
        case TopPeriod.AllTime:
            return undefined
        case TopPeriod.Today:
            return today()
        case TopPeriod.Yesterday:
            return yesterday()
        case TopPeriod.LastSevenDays:
            return lastSevenDays()
        case TopPeriod.ThisWeek:
            return thisWeek()
        case TopPeriod.LastWeek:
            return lastWeek()
        case TopPeriod.ThisMonth:
            return thisMonth()
        case TopPeriod.ThisYear:
            return thisYear()
    }
}
