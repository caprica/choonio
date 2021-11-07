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

/**
 * Bespoke formatting for a duration.
 *
 * Formats a number of seconds as either "HH:MM:SS" or "M:SS".
 *
 * The hour digits are only included if they are greater than zero, the minutes digits will include a leading zero as
 * appropriate, for example:
 *
 *     0:00
 *     0:59
 *     1:00
 *     9:59
 *    10:00
 *    59:59
 *  1:00:00
 *
 * @param {*} value
 * @return formatted duration
 */
export function formatDuration(value: number): string {
    const hours = Math.floor(value / 3600)
    const minutes = Math.floor((value % 3600) / 60)
    const seconds = Math.floor((value % 3600) % 60)
    return hours === 0
        ? `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        : `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
