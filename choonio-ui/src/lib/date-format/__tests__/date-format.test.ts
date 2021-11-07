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

import { API_DATE_FORMAT } from '../date-format'
import { DISPLAY_DATE_FORMAT } from '../date-format'
import { FILENAME_TIMESTAMP_FORMAT } from '../date-format'
import dayjs from 'dayjs'

it('formats a date for API calls', () => {
    expect(dayjs('2021-08-30T12:34:56.789').format(API_DATE_FORMAT)).toBe('2021-08-30')
})

it('formats a date for display', () => {
    expect(dayjs('2021-08-30T12:34:56.789').format(DISPLAY_DATE_FORMAT)).toBe('2021-08-30')
})

it('formats a timestamp for filenames', () => {
    expect(dayjs('2021-08-30T12:34:56.789').format(FILENAME_TIMESTAMP_FORMAT)).toBe('2021-08-30_123456')
})
