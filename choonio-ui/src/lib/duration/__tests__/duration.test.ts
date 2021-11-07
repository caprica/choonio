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

import { formatDuration } from '../duration'

it('formats seconds', () => {
    expect(formatDuration(0)).toEqual('0:00')
    expect(formatDuration(1)).toEqual('0:01')
    expect(formatDuration(59)).toEqual('0:59')
})

it('formats minutes and seconds', () => {
    expect(formatDuration(60)).toEqual('1:00')
    expect(formatDuration(61)).toEqual('1:01')
    expect(formatDuration(119)).toEqual('1:59')
    expect(formatDuration(3599)).toEqual('59:59')
})

it('formats hours, minutes, and seconds', () => {
    expect(formatDuration(3600)).toEqual('1:00:00')
    expect(formatDuration(3601)).toEqual('1:00:01')
    expect(formatDuration(3659)).toEqual('1:00:59')
    expect(formatDuration(3660)).toEqual('1:01:00')
    expect(formatDuration(3661)).toEqual('1:01:01')
    expect(formatDuration(7199)).toEqual('1:59:59')
    expect(formatDuration(36000)).toEqual('10:00:00')
})
