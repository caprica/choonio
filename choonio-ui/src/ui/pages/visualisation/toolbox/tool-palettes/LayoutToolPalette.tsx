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
import DecimalTool from '../tools/input-tool/DecimalTool'
import IntegerTool from '../tools/input-tool/IntegerTool'
import SelectTool from '../tools/select-tool/SelectTool'
import ToolPalette from './ToolPalette'

import { shapeOptions } from './options/shape-options'

export default function ImageToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const handleShapeChange = (shape: string) => setOptions({ ...options, shape })
    const handleFlatnessChange = (flatness: number) => setOptions({ ...options, flatness })
    const handleGridSizeChange = (gridSize: number) => setOptions({ ...options, gridSize })
    const handleScaleChange = (scale: number) => setOptions({ ...options, scale })
    const handleOriginXChange = (originX: number) => setOptions({ ...options, originX })
    const handleOriginYChange = (originY: number) => setOptions({ ...options, originY })

    return (
        <ToolPalette caption='Layout'>
            <SelectTool caption='Shape' value={options.shape} options={shapeOptions} onChange={handleShapeChange} />
            <DecimalTool caption='Flatness' value={options.flatness} onChange={handleFlatnessChange} />
            <IntegerTool caption='Grid size' value={options.gridSize} onChange={handleGridSizeChange} />
            <DecimalTool caption='Scale' value={options.scale} onChange={handleScaleChange} />
            <IntegerTool caption='X origin' value={options.originX} onChange={handleOriginXChange} />
            <IntegerTool caption='Y origin' value={options.originY} onChange={handleOriginYChange} />
        </ToolPalette>
    )
}
