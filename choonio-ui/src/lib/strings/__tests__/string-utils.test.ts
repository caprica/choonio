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

import { join, split } from '../string-utils'

describe('Joins arrays', () => {
    it('joins array to string', () => {
        expect(join(['one', 'two', 'three'])).toBe('one\ntwo\nthree')
    })

    it('joins empty array to string', () => {
        expect(join([])).toBe('')
    })

    it('joins missing array to string', () => {
        expect(join()).toBe('')
    })
})

describe('Splits strings', () => {
    it('splits string to array', () => {
        expect(split('one\ntwo\nthree')).toStrictEqual(['one', 'two', 'three'])
    })
})
