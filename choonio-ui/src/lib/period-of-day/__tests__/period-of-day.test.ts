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

import { periodOfDay } from '../period-of-day'

import MockDate from 'mockdate'

it('returns morning', () => {
    MockDate.set('2021-08-14T00:00:00+0100')
    expect(periodOfDay()).toEqual('morning')

    MockDate.set('2021-08-14T11:59:59+0100')
    expect(periodOfDay()).toEqual('morning')
})

it('returns afternoon', () => {
    MockDate.set('2021-08-14T12:00:00+0100')
    expect(periodOfDay()).toEqual('afternoon')

    MockDate.set('2021-08-14T16:59:59+0100')
    expect(periodOfDay()).toEqual('afternoon')
})

it('returns evening', () => {
    MockDate.set('2021-08-14T17:00:00+0100')
    expect(periodOfDay()).toEqual('evening')

    MockDate.set('2021-08-14T23:59:59+0100')
    expect(periodOfDay()).toEqual('evening')
})
