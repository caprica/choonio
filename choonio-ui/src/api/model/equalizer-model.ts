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

export interface EqualizerStateData {
    readonly preamp: number
    readonly bands: Array<number>
}

export interface EnableEqualizerRequest {
    readonly enable: boolean
}

export interface SetEqualizerRequest {
    readonly preamp: number
    readonly bands: Array<number>
}

export interface EqualizerPresetData {
    readonly name: string
    readonly preamp: number
    readonly bands: Array<number>
}
