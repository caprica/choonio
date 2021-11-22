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

import { TextTransformMode } from '../lib/text-transform'

export interface VisualisationOptions {
    period: string
    from: string
    to: string
    minimumCount: number
    top: number
    width: number
    height: number
    originX: number
    originY: number
    backgroundColour: string
    fontFamily: string
    fontWeight: string
    textMode: string // Could be TextTransformMode
    shape: string // Could be an enum
    flatness: number
    minRotation: number
    maxRotation: number
    rotationSteps: number
    rotationProbability: number
    scale: number
    gridSize: number
    highlightTopRanks: number
    topRanksColour: string
    defaultColour: string
    minimumTextSize: number
    refresh: true // unused
    seed: string
    palettes: Array<string>
}
