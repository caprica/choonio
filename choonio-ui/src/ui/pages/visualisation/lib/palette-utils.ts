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

import { ColourPalette } from '../toolbox/tools/colour-palette-tool/colour-palette-tool'

const USER_PALETTE_REGEX = /User\s(\d)+/

const DEFAULT_PALETTE_COLOUR = '#000000'

const getNewPaletteName = (palettes: Array<ColourPalette>): string => {
    const usedNames = palettes
        .map(palette => palette.name)
        .filter(name => name.match(USER_PALETTE_REGEX))
        .sort()

    if (usedNames.length > 0) {
        const lastUsedName = usedNames[usedNames.length - 1]
        const match = lastUsedName.match(USER_PALETTE_REGEX)
        if (match) {
            return `User ${parseInt(match[1]) + 1}`
        }
    }

    return 'User 1'
}

export const getNewPalette = (palettes: Array<ColourPalette>): ColourPalette => {
    return {
        name: getNewPaletteName(palettes),
        colours: [DEFAULT_PALETTE_COLOUR]
    }
}
