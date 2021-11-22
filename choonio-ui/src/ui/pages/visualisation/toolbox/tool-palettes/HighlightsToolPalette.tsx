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

import { useVisualisationOptions } from '../../hooks/options/visualisation-options-context'
import ColourTool from '../tools/colour-tool/ColourTool'
import IntegerTool from '../tools/input-tool/IntegerTool'
import ToolPalette from './ToolPalette'

export default function HighlightsToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const handleHighlightTopRanksChange = (highlightTopRanks: number) => setOptions({ ...options, highlightTopRanks })
    const handleTopRanksColourChange = (topRanksColour: string) => setOptions({ ...options, topRanksColour })

    return (
        <ToolPalette caption='Highlights'>
            <IntegerTool
                caption='Highlight top ranks'
                min={0}
                value={options.highlightTopRanks}
                onChange={handleHighlightTopRanksChange}
            />
            <ColourTool caption='Top ranks colour' value={options.topRanksColour} onChange={handleTopRanksColourChange} />
        </ToolPalette>
    )
}
