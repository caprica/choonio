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

import dayjs from 'dayjs'
import { VisualisationOptions } from '../../lib/visualisation-options'

const DATE_FORMAT = 'YYYY-MM-DD'

export const defaultVisualisationOptions: VisualisationOptions = {
    period: '',
    from: dayjs().subtract(1, 'year').format(DATE_FORMAT),
    to: dayjs().format(DATE_FORMAT),
    minimumCount: 1,
    top: 100,
    width: 1200,
    height: 800,
    originX: 0,
    originY: 0,
    backgroundColour: '#000000',
    fontFamily: 'Shrimp',
    fontWeight: 'normal',
    textMode: 'upper case',
    shape: 'circle',
    flatness: 0.65,
    minRotation: -45,
    maxRotation: 45,
    rotationSteps: 3,
    rotationProbability: 1.0,
    // scale              : 0.08,
    scale: 0.8,
    gridSize: 16,
    highlightTopRanks: 1,
    topRanksColour: 'gold',
    defaultColour: 'salmon',
    minimumTextSize: 5,
    refresh: true, // unused
    seed: 'Feed me wine gums',
    palettes: ['Cool blue', 'Neon pink']
}
