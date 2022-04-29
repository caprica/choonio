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

/**
 * This implementation was adapted from that in the "Change Case" npm package,
 * https://github.com/blakeembrey/change-case, which is distributed under the
 * MIT License.
 *
 * https://github.com/blakeembrey/change-case/blob/master/packages/title-case/src/index.ts
 */

const TOKENS = /[^\s:–—-]+|./g
const IS_MANUAL_CASE = /.(?=[A-Z]|\..)/
const ALPHANUMERIC_PATTERN = /[A-Za-z0-9\u00C0-\u00FF]/

export const toTitleCase = (input: string): string => {
    let result = ''
    let matches = null
    while ((matches = TOKENS.exec(input)) !== null) {
        const { 0: token } = matches
        if (!IS_MANUAL_CASE.test(token)) {
            result += token.replace(ALPHANUMERIC_PATTERN, (matched: string) => matched.toUpperCase())
            continue
        }
        result += token
    }
    return result
}
