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

import { useVisualisationOptions } from '../../hooks/options/visualisation-options-context'
import ColourTool from '../tools/colour-tool/ColourTool'
import IntegerTool from '../tools/input-tool/IntegerTool'
import ToolPalette from './ToolPalette'

const WIDTH_MIN = 1
const HEIGHT_MIN = 1

export default function ImageToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const handleWidthChange = (width: number) => setOptions({ ...options, width })
    const handleHeightChange = (height: number) => setOptions({ ...options, height })
    const handleBackgroundColourChange = (backgroundColour: string) => setOptions({ ...options, backgroundColour })

    return (
        <ToolPalette caption='Image'>
            <IntegerTool caption='Image width' min={WIDTH_MIN} value={options.width} onChange={handleWidthChange} />
            <IntegerTool caption='Image height' min={HEIGHT_MIN} value={options.height} onChange={handleHeightChange} />
            <ColourTool caption='Background' value={options.backgroundColour} onChange={handleBackgroundColourChange} />
        </ToolPalette>
    )
}
