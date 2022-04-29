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

import * as ranges from '../date-ranges'
import MockDate from 'mockdate'
import dayjs from 'dayjs'
import { TopPeriod } from '../../../hooks/settings/useTopStatsSettings'

beforeAll(() => {
    /*
        To ensure stable calendar-based tests, set a fixed reference date for the tests.

        Pick a date that includes a non-zero timezone offset - here we pick 14th August, 2021.

        August is month eight (note that 8-1 must be used when constructing the date instance since the Date constructor requires
        a zero-based month).

        This date is during British Summer Time, so the timezone is UTC+1.

        If you dump out this date in ISO format, it would actually show the *previous* day due to the timezone offset. This is
        because in UTC the day of August 14th 2021 starts on August 13th 2021 at 23:00.
     */
    MockDate.set(Date.UTC(2021, 8 - 1, 14))
})

it('returns today', () => {
    expect(ranges.today()).toEqual({
        fromInclusive: dayjs('2021-08-14T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })
})

it('returns yesterday', () => {
    expect(ranges.yesterday()).toEqual({
        fromInclusive: dayjs('2021-08-13T00:00:00+0100'),
        toExclusive: dayjs('2021-08-14T00:00:00+0100')
    })
})

it('returns the last seven days', () => {
    expect(ranges.lastSevenDays()).toEqual({
        fromInclusive: dayjs('2021-08-08T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })
})

it('returns the past month', () => {
    expect(ranges.pastMonth()).toEqual({
        fromInclusive: dayjs('2021-07-14T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })
})

it('returns the past twelve months', () => {
    expect(ranges.pastTwelveMonths()).toEqual({
        fromInclusive: dayjs('2020-08-14T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })
})

it('returns this week', () => {
    expect(ranges.thisWeek()).toEqual({
        fromInclusive: dayjs('2021-08-08T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })
})

it('returns last week', () => {
    expect(ranges.lastWeek()).toEqual({
        fromInclusive: dayjs('2021-08-01T00:00:00+0100'),
        toExclusive: dayjs('2021-08-08T00:00:00+0100')
    })
})

it('returns this month', () => {
    expect(ranges.thisMonth()).toEqual({
        fromInclusive: dayjs('2021-08-01T00:00:00+0100'),
        toExclusive: dayjs('2021-09-01T00:00:00+0100')
    })
})

it('returns this year', () => {
    // In January we are in GMT, not BST, so we use +0000 (or Z) when comparing here
    expect(ranges.thisYear()).toEqual({
        fromInclusive: dayjs('2021-01-01T00:00:00Z'),
        toExclusive: dayjs('2022-01-01T00:00:00Z')
    })
})

it('returns date range for period', () => {
    expect(ranges.dateRangeForPeriod(TopPeriod.AllTime)).toBe(undefined)

    expect(ranges.dateRangeForPeriod(TopPeriod.Today)).toEqual({
        fromInclusive: dayjs('2021-08-14T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })

    expect(ranges.dateRangeForPeriod(TopPeriod.Yesterday)).toEqual({
        fromInclusive: dayjs('2021-08-13T00:00:00+0100'),
        toExclusive: dayjs('2021-08-14T00:00:00+0100')
    })

    expect(ranges.dateRangeForPeriod(TopPeriod.LastSevenDays)).toEqual({
        fromInclusive: dayjs('2021-08-08T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })

    expect(ranges.dateRangeForPeriod(TopPeriod.ThisWeek)).toEqual({
        fromInclusive: dayjs('2021-08-08T00:00:00+0100'),
        toExclusive: dayjs('2021-08-15T00:00:00+0100')
    })

    expect(ranges.dateRangeForPeriod(TopPeriod.LastWeek)).toEqual({
        fromInclusive: dayjs('2021-08-01T00:00:00+0100'),
        toExclusive: dayjs('2021-08-08T00:00:00+0100')
    })

    expect(ranges.dateRangeForPeriod(TopPeriod.ThisMonth)).toEqual({
        fromInclusive: dayjs('2021-08-01T00:00:00+0100'),
        toExclusive: dayjs('2021-09-01T00:00:00+0100')
    })

    // In January we are in GMT, not BST, so we use +0000 (or Z) when comparing here
    expect(ranges.dateRangeForPeriod(TopPeriod.ThisYear)).toEqual({
        fromInclusive: dayjs('2021-01-01T00:00:00Z'),
        toExclusive: dayjs('2022-01-01T00:00:00Z')
    })
})
